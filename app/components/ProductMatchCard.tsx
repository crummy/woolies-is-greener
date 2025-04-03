import type { AUProductSchema, NZProductSchema } from "~/types/api.ts";
import { z } from "zod";
import { auLink, nzLink } from "~/services/source.ts"; // Import link functions

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
  let sourceLink: string;

  // Type guard to access properties correctly
  if ('Stockcode' in product) { // AU Product
    imageSrc = product.SmallImageFile;
    altText = product.Name;
    name = product.Name;
    sizeInfo = product.PackageSize;
    salePrice = product.Price;
    originalPrice = product.WasPrice;
    isAvailable = product.IsPurchasable;
    sourceLink = auLink(product.Stockcode.toString()); // Pass Stockcode directly
  } else { // NZ Product
    imageSrc = product.images.small;
    altText = product.name;
    name = product.name;
    sizeInfo = product.size.volumeSize;
    salePrice = product.price.salePrice;
    originalPrice = product.price.originalPrice;
    isAvailable = product.availabilityStatus === 'In Stock';
    sourceLink = nzLink(product.sku); // Pass sku directly
  }

  return (
    <div
      className={`relative p-2 border rounded cursor-pointer ${
        isSelected
          ? "border-blue-200 bg-blue-50/50"
          : "hover:bg-gray-50/50 hover:border-gray-200"
      } ${!isAvailable ? 'opacity-50' : ''}`}
      onClick={onClick} // Use the passed onClick handler
    >
      {/* Source Link Icon (Top Right) */}
      <a 
        href={sourceLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()} // Prevent card selection when clicking link
        title="View on Woolworths site"
        className="absolute top-1 right-1 p-1 text-gray-400 hover:text-blue-600"
      >
         {/* Simple link icon (replace with SVG if preferred) */} 
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>

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