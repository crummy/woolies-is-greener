import { redirect } from "react-router";
import { Form, useNavigation, useParams, Link } from "react-router";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import type { DB } from "kysely-codegen";
import { ulid } from "~/services/ulid";
import type { Route } from "./+types/admin.products_.$id";

// Loader to fetch product, all baskets, and current product baskets
export async function loader({ params, context }: Route.LoaderArgs): Promise<Response> {
  const productId = params.id;
  if (!productId) {
    throw new Response("Product ID not found", { status: 404 });
  }

  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: context.cloudflare.env.DB }),
  });

  // Fetch product, all baskets, and current product basket IDs in parallel
  const [productResult, allBasketsResult, currentLinksResult] = await Promise.allSettled([
    db
      .selectFrom("product")
      .selectAll()
      .where("id", "=", productId)
      .executeTakeFirst(),
    db
      .selectFrom("basket")
      .select(["id", "name", "description"])
      .execute(),
    db
      .selectFrom("basket_product")
      .select("basketId")
      .where("productId", "=", productId)
      .execute(),
  ]);

  // Check results carefully using Promise.allSettled
  if (productResult.status === 'rejected' || !productResult.value) {
      console.error("Failed to fetch product:", productResult.status === 'rejected' ? productResult.reason : 'Not found');
      throw new Response("Product not found", { status: 404 });
  }
  if (allBasketsResult.status === 'rejected') {
      console.error("Failed to fetch baskets:", allBasketsResult.reason);
      throw new Response("Failed to load baskets", { status: 500 });
  }
    if (currentLinksResult.status === 'rejected') {
      console.error("Failed to fetch current basket links:", currentLinksResult.reason);
      throw new Response("Failed to load current basket links", { status: 500 });
  }

  const product = productResult.value;
  const allBaskets = allBasketsResult.value;
  const currentLinks = currentLinksResult.value;

  // Extract just the IDs for easier lookup in the component
  const currentBasketIds = currentLinks.map(link => link.basketId);

  return Response.json({ product, allBaskets, currentBasketIds });
}

// Updated Action to handle product update AND basket associations
export async function action({ request, params, context }: Route.ActionArgs) {
  const productId = params.id;
  if (!productId) {
    return Response.json({ error: "Product ID missing" }, { status: 400 });
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent !== "update") {
     return Response.json({ error: "Invalid intent" }, { status: 400 });
  }

  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: context.cloudflare.env.DB }),
  });

  // Get product fields
  const title = formData.get("title");
  const nzPrice = formData.get("nzPrice");
  const nzPriceOriginal = formData.get("nzPriceOriginal");
  const auPrice = formData.get("auPrice");
  const auPriceOriginal = formData.get("auPriceOriginal");
  const nzSku = formData.get("nzSku");
  const auStockcode = formData.get("auStockcode");
  const imageUrl = formData.get("imageUrl");

  // Get submitted basket IDs
  const submittedBasketIds = new Set(formData.getAll("basketIds") as string[]);

  if (!title || !nzPrice || !nzPriceOriginal || !auPrice || !auPriceOriginal || !nzSku || !auStockcode) {
    return Response.json({ error: "Required product fields are missing" }, { status: 400 });
  }

  try {
    // 1. Update product details
    await db.updateTable("product")
      .set({
        title: title.toString(),
        nzPrice: parseInt(nzPrice.toString()),
        nzPriceOriginal: parseInt(nzPriceOriginal.toString()),
        auPrice: parseInt(auPrice.toString()),
        auPriceOriginal: parseInt(auPriceOriginal.toString()),
        nzSku: nzSku.toString(),
        auStockcode: auStockcode.toString(),
        imageUrl: imageUrl?.toString() || null,
        updated: new Date().toISOString(),
      })
      .where("id", "=", productId)
      .executeTakeFirstOrThrow();

    // 2. Get current basket associations for this product
    const currentLinks = await db
      .selectFrom("basket_product")
      .select("basketId")
      .where("productId", "=", productId)
      .execute();
    const currentBasketIds = new Set(currentLinks.map(link => link.basketId));

    // 3. Calculate differences
    const idsToAdd = [...submittedBasketIds].filter(id => !currentBasketIds.has(id));
    const idsToRemove = [...currentBasketIds].filter(id => !submittedBasketIds.has(id));

    // 4. Remove old links
    if (idsToRemove.length > 0) {
      await db
        .deleteFrom("basket_product")
        .where("productId", "=", productId)
        .where("basketId", "in", idsToRemove)
        .execute();
    }

    // 5. Add new links
    if (idsToAdd.length > 0) {
      const newLinks = idsToAdd.map(basketId => ({
        id: `bp_${ulid()}`, // Generate new ID for the link
        productId: productId,
        basketId: basketId,
      }));
      await db.insertInto("basket_product").values(newLinks).execute();
    }

    return redirect("/admin/products");

  } catch (error) {
    console.error("Failed to update product and/or baskets:", error);
    // Provide a more specific error if possible, otherwise generic
    return Response.json({ error: "Failed to save changes. Check console for details." }, { status: 500 });
  }
}

// Updated Component with Basket Checkboxes
export default function EditProductRoute({ loaderData, actionData }: Route.ComponentProps) {
  const { product, allBaskets, currentBasketIds } = loaderData
  const navigation = useNavigation();
  const params = useParams();

  // Determine if the form is submitting
  const isSubmitting = navigation.state === "submitting" && 
                     navigation.formAction === `/admin/products/${params.id}`;

  // Check for error message safely
  const errorMessage = actionData?.error;

  // Use Set for efficient checked state lookup
  const currentBasketIdSet = new Set(currentBasketIds);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Product: {product.title}</h1>

      {/* Display error message if it exists */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <Form method="post" className="space-y-4 border rounded p-4">
        <input type="hidden" name="intent" value="update" />
        
        {/* Product Fields */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input type="text" name="title" required defaultValue={product.title} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1 font-medium">NZ Price</label>
          <input type="number" name="nzPrice" required defaultValue={product.nzPrice} className="w-full p-2 border rounded"/>
        </div>
        <div>
          <label className="block mb-1 font-medium">NZ Original Price</label>
          <input type="number" name="nzPriceOriginal" required defaultValue={product.nzPriceOriginal} className="w-full p-2 border rounded"/>
        </div>
        <div>
          <label className="block mb-1 font-medium">AU Price</label>
          <input type="number" name="auPrice" required defaultValue={product.auPrice} className="w-full p-2 border rounded"/>
        </div>
        <div>
          <label className="block mb-1 font-medium">AU Original Price</label>
          <input type="number" name="auPriceOriginal" required defaultValue={product.auPriceOriginal} className="w-full p-2 border rounded"/>
        </div>
        <div>
          <label className="block mb-1 font-medium">NZ SKU</label>
          <input type="text" name="nzSku" required defaultValue={product.nzSku} className="w-full p-2 border rounded"/>
        </div>
        <div>
          <label className="block mb-1 font-medium">AU Stockcode</label>
          <input type="text" name="auStockcode" required defaultValue={product.auStockcode} className="w-full p-2 border rounded"/>
        </div>
        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input type="url" name="imageUrl" defaultValue={product.imageUrl ?? ""} className="w-full p-2 border rounded"/>
        </div>

        {/* Basket Selection Section */}
        <fieldset className="space-y-2 pt-2 border-t mt-4">
          <legend className="block mb-1 font-medium">Baskets</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {allBaskets.map((basket) => (
              <label key={basket.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="basketIds"
                  value={basket.id}
                  defaultChecked={currentBasketIdSet.has(basket.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-sm text-gray-700">{basket.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex gap-2 justify-end pt-4 border-t mt-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
          <Link to="/admin/products" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancel
            </Link>
        </div>
      </Form>
    </div>
  );
} 