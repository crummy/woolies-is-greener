import { redirect } from 'react-router';
import { Form, useNavigation, useParams, Link } from 'react-router';
import { getProductDetails, updateProduct } from '~/services/db';
import type { Route } from './+types/admin.products_.$id';

// Loader to fetch product, all baskets, and current product baskets
export async function loader({ params }: Route.LoaderArgs) {
  const productId = params.id;
  if (!productId) {
    throw new Response('Product ID not found', { status: 404 });
  }

  try {
    const { product, allBaskets, selectedBasketIds } = await getProductDetails(productId);

    return Response.json({
      product,
      allBaskets,
      selectedBasketIds: Array.from(selectedBasketIds),
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw new Response(error instanceof Error ? error.message : 'Failed to load product details', {
      status: 500,
    });
  }
}

// Updated Action to handle product update AND basket associations
export async function action({ request, params }: Route.ActionArgs) {
  const productId = params.id;
  if (!productId) {
    return Response.json({ error: 'Product ID missing' }, { status: 400 });
  }

  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent !== 'update') {
    return Response.json({ error: 'Invalid intent' }, { status: 400 });
  }

  // Get product fields
  const title = formData.get('title');
  const nzPrice = formData.get('nzPrice');
  const nzPriceOriginal = formData.get('nzPriceOriginal');
  const auPrice = formData.get('auPrice');
  const auPriceOriginal = formData.get('auPriceOriginal');
  const nzSku = formData.get('nzSku');
  const auStockcode = formData.get('auStockcode');
  const imageUrl = formData.get('imageUrl');

  // Get submitted basket IDs
  const submittedBasketIds = new Set(formData.getAll('basketIds') as string[]);

  if (
    !title ||
    !nzPrice ||
    !nzPriceOriginal ||
    !auPrice ||
    !auPriceOriginal ||
    !nzSku ||
    !auStockcode
  ) {
    return Response.json({ error: 'Required product fields are missing' }, { status: 400 });
  }

  try {
    await updateProduct(
      productId,
      {
        title: title.toString(),
        nzPrice: parseInt(nzPrice.toString()),
        nzPriceOriginal: parseInt(nzPriceOriginal.toString()),
        auPrice: parseInt(auPrice.toString()),
        auPriceOriginal: parseInt(auPriceOriginal.toString()),
        nzSku: nzSku.toString(),
        auStockcode: auStockcode.toString(),
        imageUrl: imageUrl?.toString() || null,
      },
      submittedBasketIds
    );

    return redirect('/admin/products');
  } catch (error) {
    console.error('Failed to update product and/or baskets:', error);
    // Provide a more specific error if possible, otherwise generic
    return Response.json(
      { error: 'Failed to save changes. Check console for details.' },
      { status: 500 }
    );
  }
}

// Updated Component with Basket Checkboxes
export default function EditProductRoute({ loaderData, actionData }: Route.ComponentProps) {
  const { product, allBaskets, currentBasketIds } = loaderData;
  const navigation = useNavigation();
  const params = useParams();

  // Determine if the form is submitting
  const isSubmitting =
    navigation.state === 'submitting' && navigation.formAction === `/admin/products/${params.id}`;

  // Check for error message safely
  const errorMessage = actionData?.error;

  // Use Set for efficient checked state lookup
  const currentBasketIdSet = new Set(currentBasketIds);

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Edit Product: {product.title}</h1>

      {/* Display error message if it exists */}
      {errorMessage && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
          {errorMessage}
        </div>
      )}

      <Form method="post" className="space-y-4 rounded border p-4">
        <input type="hidden" name="intent" value="update" />

        {/* Product Fields */}
        <div>
          <label className="mb-1 block font-medium">Title</label>
          <input
            type="text"
            name="title"
            required
            defaultValue={product.title}
            className="w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">NZ Price</label>
          <input
            type="number"
            name="nzPrice"
            required
            defaultValue={product.nzPrice}
            className="w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">NZ Original Price</label>
          <input
            type="number"
            name="nzPriceOriginal"
            required
            defaultValue={product.nzPriceOriginal}
            className="w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">AU Price</label>
          <input
            type="number"
            name="auPrice"
            required
            defaultValue={product.auPrice}
            className="w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">AU Original Price</label>
          <input
            type="number"
            name="auPriceOriginal"
            required
            defaultValue={product.auPriceOriginal}
            className="w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">NZ SKU</label>
          <input
            type="text"
            name="nzSku"
            required
            defaultValue={product.nzSku}
            className="w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">AU Stockcode</label>
          <input
            type="text"
            name="auStockcode"
            required
            defaultValue={product.auStockcode}
            className="w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            defaultValue={product.imageUrl ?? ''}
            className="w-full rounded border p-2"
          />
        </div>

        {/* Basket Selection Section */}
        <fieldset className="mt-4 space-y-2 border-t pt-2">
          <legend className="mb-1 block font-medium">Baskets</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {allBaskets.map((basket) => (
              <label
                key={basket.id}
                className="flex cursor-pointer items-center space-x-2 rounded border p-2 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  name="basketIds"
                  value={basket.id}
                  defaultChecked={currentBasketIdSet.has(basket.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{basket.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-4 flex justify-end gap-2 border-t pt-4">
          <button
            type="submit"
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
          <Link
            to="/admin/products"
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
}
