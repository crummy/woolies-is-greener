import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { DB } from "kysely-codegen";
import { ulid } from "~/services/ulid";

type ActionData = 
  | { success: true; newProductId?: string }
  | { error: string };

// No loader needed for a 'new' route typically

// Action to handle the creation
export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent !== "create") {
     return json<ActionData>({ error: "Invalid intent" }, { status: 400 });
  }

  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: context.cloudflare.env.DB }),
  });

  const title = formData.get("title");
  const nzPrice = formData.get("nzPrice");
  const nzPriceOriginal = formData.get("nzPriceOriginal");
  const auPrice = formData.get("auPrice");
  const auPriceOriginal = formData.get("auPriceOriginal");
  const nzSku = formData.get("nzSku");
  const auStockcode = formData.get("auStockcode");
  const imageUrl = formData.get("imageUrl");

  if (!title || !nzPrice || !nzPriceOriginal || !auPrice || !auPriceOriginal || !nzSku || !auStockcode) {
    return json<ActionData>({ error: "Required fields are missing" }, { status: 400 });
  }

  const newProductId = `p_${ulid()}`;

  try {
    await db.insertInto("product").values({
      id: newProductId,
      title: title.toString(),
      nzPrice: parseInt(nzPrice.toString()),
      nzPriceOriginal: parseInt(nzPriceOriginal.toString()),
      auPrice: parseInt(auPrice.toString()),
      auPriceOriginal: parseInt(auPriceOriginal.toString()),
      nzSku: nzSku.toString(),
      auStockcode: auStockcode.toString(),
      imageUrl: imageUrl?.toString() || null,
      updated: new Date().toISOString(),
    }).executeTakeFirstOrThrow(); // Ensure insertion happened

    // Redirect to the new product's edit page or the list page
    // return redirect(`/admin/products/${newProductId}`);
    return redirect(`/admin/products`); // Redirecting to list for now

  } catch (error) {
    console.error("Failed to create product:", error);
    return json<ActionData>({ error: "Failed to create product." }, { status: 500 });
  }
}

// The form component for creating a new product
export default function NewProductRoute() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>

      {actionData && "error" in actionData && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {actionData.error}
        </div>
      )}

      <Form method="post" className="space-y-4 border rounded p-4">
        <input type="hidden" name="intent" value="create" />
        
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input type="text" name="title" required className="w-full p-2 border rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">NZ Price</label>
            <input type="number" name="nzPrice" required className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1 font-medium">NZ Original Price</label>
            <input type="number" name="nzPriceOriginal" required className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">AU Price</label>
            <input type="number" name="auPrice" required className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1 font-medium">AU Original Price</label>
            <input type="number" name="auPriceOriginal" required className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">NZ SKU</label>
            <input type="text" name="nzSku" required className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1 font-medium">AU Stockcode</label>
            <input type="text" name="auStockcode" required className="w-full p-2 border rounded" />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input type="url" name="imageUrl" className="w-full p-2 border rounded" />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>
          <Link to="/admin/products" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
} 