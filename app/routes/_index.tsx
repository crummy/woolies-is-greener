import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { useState } from "react";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import type { DB, Basket, Product } from "kysely-codegen"; // Ensure types are available
import { convertNzdToAud, convertAudToNzd, NZD_TO_AUD_RATE } from "~/services/currency.ts"; // Import conversion functions
import { auLink, nzLink } from "~/services/source.ts"; // Import link functions

export const meta: MetaFunction = () => {
  return [
    { title: "Where The Woolies Is Greener" },
    { name: "description", content: "Compare grocery basket prices across the ditch" },
  ];
};

// Define LoaderData type
type LoaderData = {
  allBaskets: Pick<Basket, 'id' | 'name' | 'description'>[];
  selectedBasketId: string | null;
  productsInBasket: Pick<Product, 'id' | 'title' | 'auPrice' | 'nzPrice' | 'auStockcode' | 'nzSku'>[];
  totalAuPrice: number;
  totalNzPrice: number;
};

export async function loader({ context, request }: LoaderFunctionArgs): Promise<Response> {
  const db = new Kysely<DB>({
    dialect: new D1Dialect({ database: context.cloudflare.env.DB }),
  });
  const url = new URL(request.url);
  // Read the basket *name* from the query parameter
  let selectedBasketNameParam = url.searchParams.get('basket'); 

  const allBaskets = await db.selectFrom('basket')
                             .select(['id', 'name', 'description'])
                             .execute(); 

  let selectedBasket: Pick<Basket, 'id' | 'name' | 'description'> | undefined;

  // Find the selected basket by name (case-insensitive)
  if (selectedBasketNameParam) {
    selectedBasket = allBaskets.find(b => 
        b.name.toLowerCase() === selectedBasketNameParam!.toLowerCase()
    );
  }

  // Determine default/fallback basket if needed
  if (!selectedBasket && allBaskets.length > 0) {
    // Try to default to "Value Basket" by name
    selectedBasket = allBaskets.find(b => b.name.toLowerCase() === 'value basket');
    // If "Value Basket" not found, default to the first basket
    if (!selectedBasket) {
        selectedBasket = allBaskets[0];
    }
  }
  
  // Use the ID of the found/default basket
  const selectedBasketId = selectedBasket?.id ?? null;

  let productsInBasket: Pick<Product, 'id' | 'title' | 'auPrice' | 'nzPrice' | 'auStockcode' | 'nzSku'>[] = [];
  let totalAuPrice = 0;
  let totalNzPrice = 0;

  if (selectedBasketId) {
      // Fetch products for the selected basket
      productsInBasket = await db.selectFrom('product')
         .innerJoin('basket_product', 'basket_product.productId', 'product.id')
         .select(['product.id', 'product.title', 'product.auPrice', 'product.nzPrice', 'product.auStockcode', 'product.nzSku'])
         .where('basket_product.basketId', '=', selectedBasketId)
         .execute();

      // Calculate totals from fetched products
      productsInBasket.forEach(p => {
          totalAuPrice += p.auPrice || 0;
          totalNzPrice += p.nzPrice || 0;
      });
  }

  const today = new Date().toLocaleDateString();

  return Response.json({
    allBaskets,
    selectedBasketId,
    productsInBasket,
    totalAuPrice,
    totalNzPrice,
    today,
  });
}


export default function Index() {
  const { allBaskets, selectedBasketId, productsInBasket, totalAuPrice, totalNzPrice, today } = useLoaderData<LoaderData>();

  // State for selected display currency
  const [displayCurrency, setDisplayCurrency] = useState<'AUD' | 'NZD'>('AUD'); 

  // --- Sorting Logic ---
  const desiredOrder = ["value", "quality", "luxury"];

  const sortedBaskets = [...allBaskets].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    let indexA = desiredOrder.findIndex(order => nameA.includes(order));
    let indexB = desiredOrder.findIndex(order => nameB.includes(order));

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
  }

  // --- Calculate Display Totals based on selected currency ---
  const displayTotal1 = displayCurrency === 'AUD' ? totalAuPrice : convertAudToNzd(totalAuPrice);
  const displayTotal2 = displayCurrency === 'NZD' ? totalNzPrice : convertNzdToAud(totalNzPrice);
  // --- End Display Totals Calculation ---

  return (
    // Main container with yellow background
    (<div className="bg-yellow-100 min-h-screen p-6 sm:p-8 font-sans">
      {/* Header */}
      <header className="text-center mb-10 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-teal-800 mb-2">
        Where The Woolies Is Greener
        </h1>
        <p className="text-lg sm:text-xl text-teal-700">
          An experiment in grocery price comparison across the ditch
        </p>
      </header>
      {/* Basket Selection - Use sortedBaskets */}
      <section className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-10 sm:mb-12">
        {sortedBaskets.map(basket => (
           <Link 
             key={basket.id} 
             to={`/?basket=${encodeURIComponent(basket.name)}`} 
             // Basic styling, highlighting selected
             className={`p-4 sm:p-6 rounded-lg shadow-md w-36 sm:w-48 text-center transition-all duration-150 ${getBasketStyle(basket.name)} ${basket.id === selectedBasketId ? 'ring-4 ring-offset-2 ring-yellow-400 scale-105' : 'ring-0'}`}
             preventScrollReset // Keep scroll position when changing baskets
           >
             {/* Placeholder icon - replace with actual icons if available */}
             <div className="h-12 sm:h-16 mb-2 flex items-center justify-center text-3xl sm:text-4xl">🛒</div> 
             {/* Capitalize name */}
             <span className="text-base sm:text-xl font-semibold block capitalize">{basket.name}</span>
             {/* Add description */}
             {basket.description && (
               <p className="text-xs sm:text-sm mt-1 text-gray-200 opacity-90">{basket.description}</p>
             )}
           </Link>
        ))}
         {allBaskets.length === 0 && (
           <p className="text-gray-600">No baskets found.</p>
         )}
      </section>
      {/* Overall Price Display */}
      {selectedBasketId && (
         <section className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-10 sm:mb-12 max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8">
            {/* Left Side: Total Price Display */}
            <div className="flex items-center gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-600 mb-1 hidden sm:block">Overall price</p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-3xl sm:text-4xl">🇦🇺</span> 
                    <span className="text-2xl sm:text-3xl font-bold text-teal-800">
                        ${displayTotal1.toFixed(2)}
                    </span>
                  </div>
                </div>
                {/* Divider */}
                <div className="border-l h-16 border-gray-200 mx-2"></div> 
                 {/* NZD Total */}
                 <div className="text-center sm:text-left">
                   <p className="text-sm text-gray-600 mb-1 hidden sm:block opacity-0">Overall price</p> 
                   <div className="flex items-center gap-2 sm:gap-3">
                     <span className="text-3xl sm:text-4xl">🇳🇿</span> 
                     <span className="text-2xl sm:text-3xl font-bold text-teal-800">
                       ${displayTotal2.toFixed(2)}
                     </span>
                   </div>
                </div>
            </div>

            {/* Right Side: Currency Toggle */}
            <div className="flex items-center bg-gray-100 rounded-full p-1 text-sm font-medium">
                 <button 
                    onClick={() => setDisplayCurrency('AUD')} 
                    className={`px-4 py-1 rounded-full ${displayCurrency === 'AUD' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                 >
                     AUD
                 </button>
                 <button 
                    onClick={() => setDisplayCurrency('NZD')} 
                    className={`px-4 py-1 rounded-full ${displayCurrency === 'NZD' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                 >
                     NZD
                 </button>
            </div>
         </section>
      )}
      {/* Item List Table */}
      {selectedBasketId && productsInBasket.length > 0 && (
          <section className="bg-white rounded-lg shadow-md p-6 sm:p-8 max-w-3xl mx-auto">
              {/* Table Header - Update column labels */}
              <div className="grid grid-cols-3 gap-4 pb-3 sm:pb-4 border-b mb-3 sm:mb-4">
                 <h2 className="font-semibold text-base sm:text-lg text-gray-700">Item</h2>
                 <h2 className="font-semibold text-base sm:text-lg text-gray-700 text-right">Aussie</h2>
                 <h2 className="font-semibold text-base sm:text-lg text-gray-700 text-right">NZ</h2>
              </div>
              {/* Table Body */}
              <div className="space-y-2 sm:space-y-3">
                 {productsInBasket.map(product => {
                    const displayPrice1 = displayCurrency === 'AUD' ? (product.auPrice ?? 0) : convertAudToNzd(product.auPrice ?? 0);
                    const displayPrice2 = displayCurrency === 'NZD' ? (product.nzPrice ?? 0) : convertNzdToAud(product.nzPrice ?? 0);

                    const isPrice1Lower = displayPrice1 < displayPrice2;
                    const isPrice2Lower = displayPrice2 < displayPrice1;
                    // New class for the glowing dot
                    const dotGlowClass = "inline-block w-2 h-2 mr-1.5 rounded-full bg-green-400 shadow-[0_0_6px_1px_theme('colors.green.400')]"; 

                    return (
                        <div key={product.id} className="grid grid-cols-3 gap-4 text-sm sm:text-base text-gray-800 items-center">
                            <span className="truncate">{product.title}</span> 
                            {/* Removed glowClass from <a> */}
                            <a 
                              href={auLink(product.auStockcode)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={`text-right hover:underline flex items-center justify-end`} // Added flex for dot alignment
                            >
                              {/* Conditionally render the glowing dot */}
                              {isPrice1Lower && <span className={dotGlowClass}></span>}
                              <span>${displayPrice1.toFixed(2)}</span> {/* Wrap price in span for flex alignment */} 
                            </a>
                            {/* Removed glowClass from <a> */}
                            <a 
                              href={nzLink(product.nzSku)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={`text-right hover:underline flex items-center justify-end`} // Added flex for dot alignment
                            >
                              {/* Conditionally render the glowing dot */}
                              {isPrice2Lower && <span className={dotGlowClass}></span>}
                              <span>${displayPrice2.toFixed(2)}</span> {/* Wrap price in span for flex alignment */} 
                            </a>
                        </div>
                    );
                 })}
              </div>
          </section>
      )}
      {/* Empty State Messages */}
      {selectedBasketId && productsInBasket.length === 0 && (
        <div className="text-center text-gray-600 mt-8 bg-white p-4 rounded shadow-md max-w-3xl mx-auto">
          No products found in the '{allBaskets.find(b => b.id === selectedBasketId)?.name || 'selected'}' basket.
        </div>
      )}
      {!selectedBasketId && allBaskets.length > 0 && (
         <div className="text-center text-gray-600 mt-8">Please select a basket to see prices.</div>
      )}
      <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto"> {/* Moved common styles here, changed color */} 
        <p>
          This project is designed to compare approximate costs of similar items between NZ and Aus. A lot of Kiwis are heading across for jobs and I wanted to see if some basic costs were similar or if the higher wages would get absorbed. I've attempted to match like-for-like, but sometimes had to find equivalents. I ignored sales prices where suitable. Hope you find this use and informative!
        </p>
        <p className="mt-2">
         Some facts: This website was generated on {today}. At that time, the NZD/AUD exchange rate was {NZD_TO_AUD_RATE}. I made about 80% of it with AI. And it was inspired by a $7.50 avocado I saw in Melbourne.
         </p>
        <p className="mt-2">
           Feedback? <a href="mailto:crummynz@gmail.com" className="text-blue-600 hover:underline">Send me an email</a>.
        </p>
        <p className="mt-2">- Malcolm Crum</p>
      </footer>
    </div>)
  );
}