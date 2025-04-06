import { type ActionFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";
import { useState } from "react";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { type DB } from "kysely-codegen";
import { ulid } from "~/services/ulid";
import type { Route } from "./+types/admin.baskets";

export async function loader({ context }: Route.LoaderArgs) {
  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: context.cloudflare.env.DB }),
  });

  const baskets = await db.selectFrom("basket").selectAll().execute();
  return Response.json({ baskets });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: context.cloudflare.env.DB }),
  });

  if (intent === "create") {
    const name = formData.get("name");
    const description = formData.get("description");

    if (!name || !description) {
      return Response.json({ error: "Name and description are required" }, { status: 400 });
    }

    const id = `b_${ulid()}`;
    await db.insertInto("basket").values({
      id,
      name: name.toString(),
      description: description.toString(),
    }).execute();

    return Response.json({ success: true });
  }

  if (intent === "delete") {
    const id = formData.get("id");
    if (!id) {
      return Response.json({ error: "Basket ID is required" }, { status: 400 });
    }

    await db.deleteFrom("basket").where("id", "=", id.toString()).execute();
    return Response.json({ success: true });
  }

  return Response.json({ error: "Invalid intent" }, { status: 400 });
}

export default function AdminBaskets({ loaderData, actionData }: Route.ComponentProps) {
  const { baskets } = loaderData
  const navigation = useNavigation();
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Baskets</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Basket
        </button>
      </div>

      {isCreating && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Create New Basket</h2>
          <Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="create" />
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={navigation.state === "submitting"}
              >
                {navigation.state === "submitting" ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
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
        {baskets.map((basket) => (
          <div key={basket.id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{basket.name}</h3>
                <p className="text-gray-600">{basket.description}</p>
              </div>
              <Form method="post">
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="id" value={basket.id ?? ""} />
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
        ))}
      </div>
    </div>
  );
}
