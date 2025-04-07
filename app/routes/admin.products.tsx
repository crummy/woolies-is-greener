import { useNavigation, Link } from 'react-router';
import type { Product } from 'kysely-codegen';
import { ProductCard } from '~/components/ProductCard';
import { getProductsWithBaskets, getBaskets, deleteProduct } from '~/services/db';
import type { Route } from './+types/admin.products';

// Define the type for a product with baskets (including basket IDs)
export type ProductWithBasketObjects = Product & {
  baskets: { id: string; name: string }[];
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const selectedBasketId = url.searchParams.get('basketId');

  // Use the DB service functions without context
  const allBaskets = await getBaskets();
  const products = await getProductsWithBaskets(selectedBasketId);

  // Calculate totals
  const totals = products.reduce(
    (acc, product) => {
      acc.au += product.auPrice || 0;
      acc.nz += product.nzPrice || 0;
      return acc;
    },
    { au: 0, nz: 0 }
  );

  return { products, baskets: allBaskets, selectedBasketId, totals };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'delete') {
    const id = formData.get('id');
    if (!id) {
      return Response.json({ error: 'Product ID is required' }, { status: 400 });
    }
    try {
      await deleteProduct(id.toString());
      // Return empty object on success
      return Response.json({});
    } catch (error) {
      console.error('Failed to delete product:', error);
      return Response.json({ error: 'Failed to delete product.' }, { status: 500 });
    }
  }

  return Response.json({ error: 'Invalid intent for this route' }, { status: 400 });
}

export default function AdminProducts({ actionData, loaderData }: Route.ComponentProps) {
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

  const baseButtonClass = 'px-3 py-1 rounded text-sm border';
  const inactiveButtonClass = 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  const activeButtonClass = 'bg-blue-500 text-white border-blue-600';

  return (
    <div className="p-4">
      {/* Combined Header and Filters */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Products</h1>

        {/* Totals and Filters Section - MOVED HERE */}
        {/* Removed bg-gray-50, border, p-3 */}
        <div className="flex items-center gap-6">
          {' '}
          {/* Increased gap slightly */}
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
          <div className="flex items-center gap-2">
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
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Create New Product
        </Link>
      </div>

      {/* Display error message if it exists */}
      {errorMessage && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4">
        {products.map((product: ProductWithBasketObjects) => (
          <ProductCard key={product.id} product={product} navigation={navigation} />
        ))}
      </div>
    </div>
  );
}
