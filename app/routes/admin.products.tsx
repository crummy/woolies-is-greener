import { useNavigation, Link } from "react-router";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { type DB } from "kysely-codegen";
import { sql } from "kysely";
import { ProductCard } from "~/components/ProductCard";
import type { Route } from "./+types/_index";

// Define the type for a product with baskets (including basket IDs)
type ProductFromDB = DB['product']; 
// Export the interface
export interface ProductWithBasketObjects extends ProductFromDB {
  baskets: { id: string; name: string }[];
}

export async function loader({ context, request }: Route.LoaderArgs){
  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: context.cloudflare.env.DB }),
  });

  const url = new URL(request.url);
  const selectedBasketId = url.searchParams.get('basketId');

  // Fetch all baskets for the filter buttons
  const allBaskets = await db.selectFrom("basket").select(['id', 'name']).execute();

  // Fetch products and aggregate basket info (id:name)
  const productsData = await db
    .selectFrom("product")
    .leftJoin("basket_product", "basket_product.productId", "product.id")
    .leftJoin("basket", "basket.id", "basket_product.basketId")
    .selectAll("product")
    // Concatenate ID and Name, separated by a colon, rows separated by comma
    .$call((qb) => qb.select(sql<string | null>`GROUP_CONCAT(basket.id || ':' || basket.name)`.as("basketInfo")))
    .groupBy("product.id")
    .execute();

  // Process the result to create the baskets array with IDs and names
  const processedProducts = productsData.map(productRow => {
    const { basketInfo, ...productFields } = productRow;
    const baskets = basketInfo
      ? basketInfo.split(',').map(info => {
          // Find the first colon to split, handle names containing colons
          const colonIndex = info.indexOf(':');
          if (colonIndex === -1) return null; // Malformed data?
          const id = info.substring(0, colonIndex);
          const name = info.substring(colonIndex + 1);
          return { id, name };
        }).filter(Boolean) as { id: string; name: string }[] // Filter out any nulls from malformed data
      : [];
    
    return {
      ...productFields,
      baskets,
    } as ProductWithBasketObjects; 
  });

  // Filter products if a basketId is selected
  let displayedProducts = processedProducts;
  if (selectedBasketId) {
      displayedProducts = processedProducts.filter(p => 
          p.baskets.some(b => b.id === selectedBasketId)
      );
  }

  return Response.json({ products: displayedProducts, baskets: allBaskets, selectedBasketId });
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: context.cloudflare.env.DB }),
  });

  if (intent === "delete") {
    const id = formData.get("id");
    if (!id) {
      return Response.json({ error: "Product ID is required" }, { status: 400 });
    }
    try {
      await db.deleteFrom("product").where("id", "=", id.toString()).executeTakeFirstOrThrow();
      // Return empty object on success
      return Response.json({}); 
    } catch (error) {
        console.error("Failed to delete product:", error);
        return Response.json({ error: "Failed to delete product." }, { status: 500 });
    }
  }

  return Response.json({ error: "Invalid intent for this route" }, { status: 400 });
}

export default function AdminProducts({ actionData, loaderData}: Route.ComponentProps) {
  // Add explicit type to useLoaderData
  const { products, baskets, selectedBasketId } = loaderData; 
  const navigation = useNavigation();

  // Calculate totals
  const totals = products.reduce(
    (acc, product) => {
      acc.au += product.auPrice || 0;
      acc.nz += product.nzPrice || 0;
      return acc;
    },
    { au: 0, nz: 0 }
  );

  // Check if there's an error message to display
  const errorMessage = actionData && 'error' in actionData ? actionData.error : null;

  const baseButtonClass = "px-3 py-1 rounded text-sm border";
  const inactiveButtonClass = "bg-gray-100 text-gray-700 hover:bg-gray-200";
  const activeButtonClass = "bg-blue-500 text-white border-blue-600";

  return (
    <div className="p-4">
      {/* Combined Header and Filters */}
      <div className="flex justify-between items-center mb-6"> 
        <h1 className="text-2xl font-bold">Manage Products</h1>

        {/* Totals and Filters Section - MOVED HERE */}
        {/* Removed bg-gray-50, border, p-3 */} 
        <div className="flex items-center gap-6"> {/* Increased gap slightly */} 
          {/* Totals Display */} 
          <div className="flex gap-4">
            {/* Removed text-gray-700 */} 
            <p className="text-sm font-medium">
              AU Total: <span className="font-bold">${totals.au.toFixed(2)}</span>
            </p>
            {/* Removed text-gray-700 */} 
            <p className="text-sm font-medium">
              NZ Total: <span className="font-bold">${totals.nz.toFixed(2)}</span>
            </p>
          </div>

          {/* Filter Buttons */} 
          <div className="flex gap-2 items-center">
             {/* Removed text-gray-700 */} 
            <span className="text-sm font-medium">Filter by Basket:</span>
            {/* "Show All" Button */} 
            <Link
              to="/admin/products"
              className={`${baseButtonClass} ${!selectedBasketId ? activeButtonClass : inactiveButtonClass}`}
              preventScrollReset // Prevent scrolling to top on navigation
            >
              Show All
            </Link>
            {/* Basket Filter Buttons */} 
            {baskets.map((basket) => (
              <Link
                key={basket.id}
                to={`/admin/products?basketId=${basket.id}`}
                className={`${baseButtonClass} ${selectedBasketId === basket.id ? activeButtonClass : inactiveButtonClass}`}
                preventScrollReset // Prevent scrolling to top on navigation
              >
                {basket.name}
              </Link>
            ))}
          </div>
        </div>

        {/* "Create New Product" Button - Remains at the end */}
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
        {products.map((product: ProductWithBasketObjects) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            navigation={navigation} 
          />
        ))}
      </div>
    </div>
  );
}
