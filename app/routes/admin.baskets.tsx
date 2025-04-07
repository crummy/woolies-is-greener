import { Form, useNavigation } from 'react-router';
import { useState } from 'react';
import { getAllBaskets, createBasket, deleteBasket } from '~/services/db';
import type { Route } from './+types/admin.baskets';

export async function loader() {
  const baskets = await getAllBaskets();
  return { baskets };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'create') {
    const name = formData.get('name');
    const description = formData.get('description');

    if (!name || !description) {
      return Response.json({ error: 'Name and description are required' }, { status: 400 });
    }

    await createBasket(name.toString(), description.toString());
    return Response.json({ success: true });
  }

  if (intent === 'delete') {
    const id = formData.get('id');
    if (!id) {
      return Response.json({ error: 'Basket ID is required' }, { status: 400 });
    }

    await deleteBasket(id.toString());
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Invalid intent' }, { status: 400 });
}

export default function AdminBaskets({ loaderData, actionData }: Route.ComponentProps) {
  const { baskets } = loaderData;
  const navigation = useNavigation();
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Baskets</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Create New Basket
        </button>
      </div>

      {isCreating && (
        <div className="mb-6 rounded border p-4">
          <h2 className="mb-4 text-xl font-semibold">Create New Basket</h2>
          <Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="create" />
            <div>
              <label className="mb-1 block">Name</label>
              <input type="text" name="name" required className="w-full rounded border p-2" />
            </div>
            <div>
              <label className="mb-1 block">Description</label>
              <textarea name="description" required className="w-full rounded border p-2" />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                disabled={navigation.state === 'submitting'}
              >
                {navigation.state === 'submitting' ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </Form>
        </div>
      )}

      {actionData && 'error' in actionData && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {actionData.error}
        </div>
      )}

      <div className="grid gap-4">
        {baskets.map((basket) => (
          <div key={basket.id} className="rounded border p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{basket.name}</h3>
                <p className="text-gray-600">{basket.description}</p>
              </div>
              <Form method="post">
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="id" value={basket.id ?? ''} />
                <button
                  type="submit"
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  disabled={navigation.state === 'submitting'}
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
