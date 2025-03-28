import { json, LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { DB } from "kysely-codegen";
import { ulid } from "~/services/ulid";

type ActionData = 
  | { success: true }
  | { error: string };

export async function loader({ context }: LoaderFunctionArgs) {
  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: context.cloudflare.env.DB }),
  });

  const products = await db.selectFrom("product").selectAll().execute();
  return json({ products });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: context.cloudflare.env.DB }),
  });

  if (intent === "create") {
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

    const id = `p_${ulid()}`;
    await db.insertInto("product").values({
      id,
      title: title.toString(),
      nzPrice: parseInt(nzPrice.toString()),
      nzPriceOriginal: parseInt(nzPriceOriginal.toString()),
      auPrice: parseInt(auPrice.toString()),
      auPriceOriginal: parseInt(auPriceOriginal.toString()),
      nzSku: nzSku.toString(),
      auStockcode: auStockcode.toString(),
      imageUrl: imageUrl?.toString() || null,
      updated: new Date().toISOString(),
    }).execute();

    return json<ActionData>({ success: true });
  }

  if (intent === "update") {
    const id = formData.get("id");
    const title = formData.get("title");
    const nzPrice = formData.get("nzPrice");
    const nzPriceOriginal = formData.get("nzPriceOriginal");
    const auPrice = formData.get("auPrice");
    const auPriceOriginal = formData.get("auPriceOriginal");
    const nzSku = formData.get("nzSku");
    const auStockcode = formData.get("auStockcode");
    const imageUrl = formData.get("imageUrl");

    if (!id || !title || !nzPrice || !nzPriceOriginal || !auPrice || !auPriceOriginal || !nzSku || !auStockcode) {
      return json<ActionData>({ error: "Required fields are missing" }, { status: 400 });
    }

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
      .where("id", "=", id.toString())
      .execute();

    return json<ActionData>({ success: true });
  }

  if (intent === "delete") {
    const id = formData.get("id");
    if (!id) {
      return json<ActionData>({ error: "Product ID is required" }, { status: 400 });
    }

    await db.deleteFrom("product").where("id", "=", id.toString()).execute();
    return json<ActionData>({ success: true });
  }

  return json<ActionData>({ error: "Invalid intent" }, { status: 400 });
}

export default function AdminProducts() {
  const { products } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Product
        </button>
      </div>

      {(isCreating || editingProduct) && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? "Edit Product" : "Create New Product"}
          </h2>
          <Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value={editingProduct ? "update" : "create"} />
            {editingProduct && <input type="hidden" name="id" value={editingProduct.id ?? ""} />}
            
            <div>
              <label className="block mb-1">Title</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={editingProduct?.title}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">NZ Price</label>
                <input
                  type="number"
                  name="nzPrice"
                  required
                  defaultValue={editingProduct?.nzPrice}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">NZ Original Price</label>
                <input
                  type="number"
                  name="nzPriceOriginal"
                  required
                  defaultValue={editingProduct?.nzPriceOriginal}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">AU Price</label>
                <input
                  type="number"
                  name="auPrice"
                  required
                  defaultValue={editingProduct?.auPrice}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">AU Original Price</label>
                <input
                  type="number"
                  name="auPriceOriginal"
                  required
                  defaultValue={editingProduct?.auPriceOriginal}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">NZ SKU</label>
                <input
                  type="text"
                  name="nzSku"
                  required
                  defaultValue={editingProduct?.nzSku}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">AU Stockcode</label>
                <input
                  type="text"
                  name="auStockcode"
                  required
                  defaultValue={editingProduct?.auStockcode}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                defaultValue={editingProduct?.imageUrl ?? ""}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={navigation.state === "submitting"}
              >
                {navigation.state === "submitting" 
                  ? (editingProduct ? "Updating..." : "Creating...") 
                  : (editingProduct ? "Update" : "Create")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingProduct(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </Form>
        </div>
      )}

      {actionData && "error" in actionData && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {actionData.error}
        </div>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                {product.imageUrl && (
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{product.title}</h3>
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
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <Form method="post">
                  <input type="hidden" name="intent" value="delete" />
                  <input type="hidden" name="id" value={product.id ?? ""} />
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    disabled={navigation.state === "submitting"}
                  >
                    Delete
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
