import { type ProductWithBasketObjects } from '~/routes/admin.products.tsx'; // Use .tsx and type import
import { Link, Form, type Navigation } from 'react-router';

type ProductCardProps = {
  product: ProductWithBasketObjects;
  navigation: Navigation; // Pass navigation state for delete button
};

export function ProductCard({ product, navigation }: ProductCardProps) {
  return (
    <div key={product.id} className="rounded border p-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-grow gap-4">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-24 w-24 flex-shrink-0 rounded object-cover"
            />
          )}
          <div className="flex-grow">
            <h3 className="text-lg font-semibold">{product.title}</h3>
            {product.baskets && product.baskets.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {product.baskets.map((basket: { id: string; name: string }) => (
                  <span
                    key={basket.id}
                    className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700"
                  >
                    {basket.name}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-2 grid grid-cols-2 gap-4">
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
        <div className="ml-4 flex flex-shrink-0 gap-2">
          <Link
            to={`/admin/products/${product.id}`}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          >
            Edit
          </Link>
          <Form method="post">
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="id" value={product.id ?? ''} />
            <button
              type="submit"
              className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
              disabled={
                navigation.state === 'submitting' && navigation.formData?.get('id') === product.id
              }
            >
              {navigation.state === 'submitting' && navigation.formData?.get('id') === product.id
                ? 'Deleting...'
                : 'Delete'}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

// Ensure the type is exported from the route file or move it to a shared types file
// Example export needed in app/routes/admin.products.tsx:
// export type { ProductWithBasketObjects };
