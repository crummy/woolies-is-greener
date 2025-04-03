import { type ProductWithBasketObjects } from "~/routes/admin.products.tsx"; // Use .tsx and type import
import { Link, Form, type Navigation } from "@remix-run/react";

type ProductCardProps = {
  product: ProductWithBasketObjects;
  navigation: Navigation; // Pass navigation state for delete button
};

export function ProductCard({ product, navigation }: ProductCardProps) {
  return (
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
                {product.baskets.map((basket: { id: string; name: string }) => (
                  <span 
                    key={basket.id}
                    className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full"
                  >
                    {basket.name}
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
  );
}

// Ensure the type is exported from the route file or move it to a shared types file
// Example export needed in app/routes/admin.products.tsx:
// export type { ProductWithBasketObjects }; 