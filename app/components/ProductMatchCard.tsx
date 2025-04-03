import type { AUProductSchema, NZProductSchema } from "~/types/api.ts";
import { z } from "zod";

type AUProduct = z.infer<typeof AUProductSchema>;
type NZProduct = z.infer<typeof NZProductSchema>;

type ProductMatchCardProps = {
  product: AUProduct | NZProduct;
  isSelected: boolean;
  onClick: () => void;
};

export function ProductMatchCard({ product, isSelected, onClick }: ProductMatchCardProps) {
  let imageSrc: string;
  let altText: string;
  let name: string;
  let sizeInfo: string | null;
  let salePrice: number | null | undefined;
  let originalPrice: number | null | undefined;
  let isAvailable: boolean;

  // Type guard to access properties correctly
  if ('Stockcode' in product) { // AU Product
    imageSrc = product.SmallImageFile;
    altText = product.Name;
    name = product.Name;
    sizeInfo = product.PackageSize;
    salePrice = product.Price;
    originalPrice = product.WasPrice;
    isAvailable = product.IsPurchasable;
  } else { // NZ Product
    imageSrc = product.images.small;
    altText = product.name;
    name = product.name;
    sizeInfo = product.size.volumeSize;
    salePrice = product.price.salePrice;
    originalPrice = product.price.originalPrice;
    isAvailable = product.availabilityStatus === 'In Stock';
  }

  return (
    <div
      className={`p-2 border rounded cursor-pointer ${
        isSelected
          ? "border-blue-200 bg-blue-50/50"
          : "hover:bg-gray-50/50 hover:border-gray-200"
      } ${!isAvailable ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={onClick} // Use the passed onClick handler
    >
      <div className="flex items-start gap-2">
        <img
          src={imageSrc}
          alt={altText}
          className="w-16 h-16 object-contain"
        />
        <div>
          <h3 className="font-medium">{name}</h3>
          {sizeInfo && <p className="text-sm text-gray-600">{sizeInfo}</p>}
          <p className="text-sm">
            <span className="font-bold">${salePrice?.toFixed(2) ?? 'N/A'}</span>
            {originalPrice && originalPrice !== salePrice && (
              <span className="ml-2 line-through text-gray-500">${originalPrice.toFixed(2)}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
} 