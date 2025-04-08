import type { MetaFunction } from 'react-router';
import { useState, useMemo } from 'react';
import { convertNzdToAud, convertAudToNzd, NZD_TO_AUD_RATE } from '~/services/currency'; // Import conversion functions
import { auLink, nzLink } from '~/services/source'; // Import link functions
import { getBaskets, getProductsWithBaskets } from '~/services/db'; // Import DB functions
import type { Route } from './+types/_index';
import type { Product, Basket } from 'kysely-codegen';

export const meta: MetaFunction = () => {
  return [
    { title: 'Where The Woolies Is Greener' },
    { name: 'description', content: 'Compare grocery basket prices across the ditch' },
  ];
};

// Type for a product with basket information
type ProductWithBaskets = Product & {
  baskets: { id: string; name: string }[];
};

// Type for basket data structure
type BasketData = {
  basketId: string | null;
  products: ProductWithBaskets[];
};

// Type for productsByBasket mapping
type ProductsByBasketMap = {
  [key: string]: BasketData;
};

export async function loader() {
  // Fetch all baskets
  const allBaskets = await getBaskets();

  // Fetch all products with their baskets
  const allProducts = await getProductsWithBaskets();

  // Group products by basket for easier client-side filtering
  const productsByBasket: ProductsByBasketMap = {};

  // Create entries for all baskets
  allBaskets.forEach((basket: Basket) => {
    productsByBasket[basket.name.toLowerCase()] = {
      basketId: basket.id,
      products: [],
    };
  });

  // Assign products to their baskets
  allProducts.forEach((product: ProductWithBaskets) => {
    product.baskets.forEach((basket) => {
      const basketName = basket.name.toLowerCase();
      if (productsByBasket[basketName]) {
        productsByBasket[basketName].products.push(product);
      }
    });
  });

  return {
    allBaskets,
    allProducts,
    productsByBasket,
    today: new Date().toISOString().split('T')[0],
  };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { allBaskets, productsByBasket, today } = loaderData;

  // Get the selected basket from URL or default to "value"
  const [selectedBasket, setSelectedBasket] = useState<string>('value');

  // Get the current basket's products
  const currentBasketData = useMemo(
      () => productsByBasket[selectedBasket] || { products: [], basketId: null },
      [productsByBasket, selectedBasket]
  );

  const productsInBasket = currentBasketData.products;

  // Calculate totals for the selected basket
  const { totalAuPrice, totalNzPrice } = useMemo(() => {
    let auTotal = 0;
    let nzTotal = 0;
    for (const product of productsInBasket) {
      auTotal += product.auPrice || 0;
      nzTotal += product.nzPrice || 0;
    }
    return { totalAuPrice: auTotal, totalNzPrice: nzTotal };
  }, [productsInBasket]);

  // State for selected display currency
  const [displayCurrency, setDisplayCurrency] = useState<'AUD' | 'NZD'>('AUD');

  // --- Sorting Logic ---
  const desiredOrder = ['value', 'quality', 'luxury'];

  const sortedBaskets = [...allBaskets].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    let indexA = desiredOrder.findIndex((order) => nameA.includes(order));
    let indexB = desiredOrder.findIndex((order) => nameB.includes(order));

    // If both are in desired order, sort by that order
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // If only A is in desired order, A comes first
    if (indexA !== -1) {
      return -1;
    }
    // If only B is in desired order, B comes first
    if (indexB !== -1) {
      return 1;
    }
    // Otherwise, sort alphabetically
    return nameA.localeCompare(nameB);
  });
  // --- End Sorting Logic ---

  // Helper to get basket styles (adjust colors as needed)
  const getBasketStyle = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('value')) return 'bg-green-600 hover:bg-green-700 text-white';
    if (lowerName.includes('quality')) return 'bg-orange-500 hover:bg-orange-600 text-white';
    if (lowerName.includes('luxury')) return 'bg-cyan-500 hover:bg-cyan-600 text-white';
    return 'bg-gray-500 hover:bg-gray-600 text-white'; // Default
  };

  const displayTotal1 = displayCurrency === 'AUD' ? totalAuPrice : convertAudToNzd(totalAuPrice);
  const displayTotal2 = displayCurrency === 'NZD' ? totalNzPrice : convertNzdToAud(totalNzPrice);

  return (
      // Main container with yellow background
      <div className="min-h-screen bg-yellow-100 p-6 font-sans sm:p-8">
        {/* Header */}
        <header className="mb-10 text-center sm:mb-12">
          <h1 className="mb-2 text-3xl font-bold text-teal-800 sm:text-4xl">
            Where The Woolies Is Greener
          </h1>
          <p className="text-lg text-teal-700 sm:text-xl">
            An experiment in grocery price comparison across the ditch
          </p>
        </header>
        {/* Basket Selection - Use sortedBaskets */}
        <section className="mb-10 flex flex-wrap justify-center gap-4 sm:mb-12 sm:gap-8">
          {sortedBaskets.map((basket) => (
              <a
                  key={basket.id}
                  onClick={() => setSelectedBasket(basket.name.toLowerCase())}
                  // Basic styling, highlighting selected
                  className={`w-36 rounded-lg p-4 text-center shadow-md transition-all duration-150 sm:w-48 sm:p-6 ${getBasketStyle(basket.name)} ${basket.name.toLowerCase() === selectedBasket ? 'scale-105 ring-4 ring-yellow-400 ring-offset-2' : 'ring-0'} cursor-pointer`}
              >
                {/* Placeholder icon - replace with actual icons if available */}
                <div className="mb-2 flex h-12 items-center justify-center text-3xl sm:h-16 sm:text-4xl">
                  🛒
                </div>
                {/* Capitalize name */}
                <span className="block text-base font-semibold capitalize sm:text-xl">
              {basket.name}
            </span>
                {/* Add description */}
                {basket.description && (
                    <p className="mt-1 text-xs text-gray-200 opacity-90 sm:text-sm">
                      {basket.description}
                    </p>
                )}
              </a>
          ))}
          {allBaskets.length === 0 && <p className="text-gray-600">No baskets found.</p>}
        </section>
        {/* Overall Price Display */}
        <section className="mx-auto mb-10 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-lg bg-white p-6 shadow-md sm:mb-12 sm:flex-row sm:gap-8 sm:p-8">
          {/* Left Side: Total Price Display */}
          <div className="flex items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="mb-1 hidden text-sm text-gray-600 sm:block">Overall price</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-3xl sm:text-4xl">🇦🇺</span>
                <span className="text-2xl font-bold text-teal-800 sm:text-3xl">
                ${displayTotal1.toFixed(2)}
              </span>
              </div>
            </div>
            {/* Divider */}
            <div className="mx-2 h-16 border-l border-gray-200"></div>
            {/* NZD Total */}
            <div className="text-center sm:text-left">
              <p className="mb-1 hidden text-sm text-gray-600 opacity-0 sm:block">Overall price</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-3xl sm:text-4xl">🇳🇿</span>
                <span className="text-2xl font-bold text-teal-800 sm:text-3xl">
                ${displayTotal2.toFixed(2)}
              </span>
              </div>
            </div>
          </div>

          {/* Right Side: Currency Toggle */}
          <div className="flex items-center rounded-full bg-gray-100 p-1 text-sm font-medium">
            <button
                onClick={() => setDisplayCurrency('AUD')}
                className={`rounded-full px-4 py-1 ${displayCurrency === 'AUD' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              AUD
            </button>
            <button
                onClick={() => setDisplayCurrency('NZD')}
                className={`rounded-full px-4 py-1 ${displayCurrency === 'NZD' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              NZD
            </button>
          </div>
        </section>
        {/* Item List Table */}
        {productsInBasket.length > 0 && (
            <section className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md sm:p-8">
              {/* Table Header - Update column labels */}
              <div className="mb-3 grid grid-cols-3 gap-4 border-b pb-3 sm:mb-4 sm:pb-4">
                <h2 className="text-base font-semibold text-gray-700 sm:text-lg">Item</h2>
                <h2 className="text-right text-base font-semibold text-gray-700 sm:text-lg">Aussie</h2>
                <h2 className="text-right text-base font-semibold text-gray-700 sm:text-lg">NZ</h2>
              </div>
              {/* Table Body */}
              <div className="space-y-2 sm:space-y-3">
                {productsInBasket.map((product) => {
                  const displayPrice1 =
                      displayCurrency === 'AUD'
                          ? (product.auPrice ?? 0)
                          : convertAudToNzd(product.auPrice ?? 0);
                  const displayPrice2 =
                      displayCurrency === 'NZD'
                          ? (product.nzPrice ?? 0)
                          : convertNzdToAud(product.nzPrice ?? 0);

                  const isPrice1Lower = displayPrice1 < displayPrice2;
                  const isPrice2Lower = displayPrice2 < displayPrice1;
                  // New class for the glowing dot
                  const dotGlowClass =
                      "inline-block w-2 h-2 mr-1.5 rounded-full bg-green-400 shadow-[0_0_6px_1px_theme('colors.green.400')]";

                  return (
                      <div
                          key={product.id}
                          className="grid grid-cols-3 items-center gap-4 text-sm text-gray-800 sm:text-base"
                      >
                        <span className="truncate">{product.title}</span>
                        {/* Removed glowClass from <a> */}
                        <a
                            href={auLink(product.auStockcode)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-end text-right hover:underline`} // Added flex for dot alignment
                        >
                          {/* Conditionally render the glowing dot */}
                          {isPrice1Lower && <span className={dotGlowClass}></span>}
                          <span>${displayPrice1.toFixed(2)}</span>{' '}
                          {/* Wrap price in span for flex alignment */}
                        </a>
                        {/* Removed glowClass from <a> */}
                        <a
                            href={nzLink(product.nzSku)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-end text-right hover:underline`} // Added flex for dot alignment
                        >
                          {/* Conditionally render the glowing dot */}
                          {isPrice2Lower && <span className={dotGlowClass}></span>}
                          <span>${displayPrice2.toFixed(2)}</span>{' '}
                          {/* Wrap price in span for flex alignment */}
                        </a>
                      </div>
                  );
                })}
              </div>
            </section>
        )}
        {/* Empty State Messages */}
        {productsInBasket.length === 0 && (
            <div className="mx-auto mt-8 max-w-3xl rounded bg-white p-4 text-center text-gray-600 shadow-md">
              No products found in the '{selectedBasket}' basket.
            </div>
        )}
        <footer className="mx-auto mt-12 max-w-2xl border-t border-gray-300 pt-6 text-center text-xs text-gray-500 sm:text-sm">
          <p>
            This project is designed to compare approximate costs of similar items between NZ and Aus.
            A lot of Kiwis are heading across for jobs and I wanted to see if some basic costs were
            similar or if the higher wages would get absorbed. I've attempted to match like-for-like,
            but sometimes had to find equivalents. I ignored sales prices where suitable. Hope you
            find this use and informative!
          </p>
          <p className="mt-2">
            Some facts: This website was generated on {today}. At that time, the NZD/AUD exchange rate
            was {NZD_TO_AUD_RATE}. I made about 80% of it with AI. And it was inspired by a $7.50
            avocado I saw in Melbourne.
          </p>
          <p className="mt-2">
            Feedback?{' '}
            <a href="mailto:crummynz@gmail.com" className="text-blue-600 hover:underline">
              Send me an email
            </a>
            .
          </p>
          <p className="mt-2">- Malcolm Crum</p>
        </footer>
      </div>
  );
}
