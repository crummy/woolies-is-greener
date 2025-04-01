import { json, LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation, Link } from "@remix-run/react";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { DB } from "kysely-codegen";
import { sql } from "kysely";

// Define the type for a product with baskets
type ProductFromDB = DB['product']; 
interface ProductWithBaskets extends ProductFromDB {
  baskets: string[];
}

// ActionData type for this route (allows error or empty success object)
type ActionData = { error: string } | { /* Empty object for success */ };

export async function loader({ context }: LoaderFunctionArgs) {
  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: context.cloudflare.env.DB }),
  });

  // Single query to fetch products and concatenated basket names
  const productsData = await db
    .selectFrom("product")
    .leftJoin("basket_product", "basket_product.productId", "product.id")
    .leftJoin("basket", "basket.id", "basket_product.basketId")
    // Select all columns from the product table
    .selectAll("product")
    // Use GROUP_CONCAT to aggregate basket names into a single string
    // Specify the expected return type as string | null
    .$call((qb) => qb.select(sql<string | null>`GROUP_CONCAT(basket.name)`.as("basketNames")))
    // Group by product ID to ensure one row per product
    .groupBy("product.id")
    .execute();

  // Process the result to split concatenated names into an array
  const productsWithBaskets = productsData.map(productRow => {
    // Extract the concatenated basket names string
    const { basketNames, ...productFields } = productRow;
    
    // Split the string into an array, handle null/empty case
    const baskets = basketNames ? basketNames.split(',') : [];
    
    return {
      ...productFields,
      baskets, // Add the array of basket names
    } as ProductWithBaskets; // Assert type
  });

  return json({ products: productsWithBaskets });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: context.cloudflare.env.DB }),
  });

  if (intent === "delete") {
    const id = formData.get("id");
    if (!id) {
      return json<ActionData>({ error: "Product ID is required" }, { status: 400 });
    }
    try {
      await db.deleteFrom("product").where("id", "=", id.toString()).executeTakeFirstOrThrow();
      // Return empty object on success
      return json<ActionData>({}); 
    } catch (error) {
        console.error("Failed to delete product:", error);
        return json<ActionData>({ error: "Failed to delete product." }, { status: 500 });
    }
  }

  return json<ActionData>({ error: "Invalid intent for this route" }, { status: 400 });
}

export default function AdminProducts() {
  const { products } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  // Check if there's an error message to display
  const errorMessage = actionData && 'error' in actionData ? actionData.error : null;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Product
        </Link>
      </div>

      {/* Display error message if it exists */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4">
        {products.map((product: ProductWithBaskets) => (
          <div key={product.id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 flex-grow">
                {product.imageUrl && (
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  {product.baskets && product.baskets.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.baskets.map((basketName: string) => (
                        <span 
                          key={basketName}
                          className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full"
                        >
                          {basketName}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-600">NZ Price: ${product.nzPrice}</p>
                      <p className="text-sm text-gray-500">Original: ${product.nzPriceOriginal}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">AU Price: ${product.auPrice}</p>
                      <p className="text-sm text-gray-500">Original: ${product.auPriceOriginal}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">NZ SKU: {product.nzSku}</p>
                    <p className="text-sm text-gray-600">AU Stockcode: {product.auStockcode}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-4">
                <Link
                  to={`/admin/products/${product.id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </Link>
                <Form method="post">
                  <input type="hidden" name="intent" value="delete" />
                  <input type="hidden" name="id" value={product.id ?? ""} />
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    disabled={navigation.state === "submitting" && navigation.formData?.get('id') === product.id}
                  >
                    {navigation.state === "submitting" && navigation.formData?.get('id') === product.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </Form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
