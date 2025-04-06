import { useState, useMemo, useEffect, useRef } from "react";
import type { AUProductSchema, NZProductSchema } from "~/types/api";
import { z } from "zod";
import { searchWoolworths } from "~/services/search";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { Form, useActionData, useNavigation, useSearchParams, useLoaderData } from "react-router";
import { linkProducts } from "~/services/db";
import { ProductMatchCard } from "~/components/ProductMatchCard";
import { Toast } from "~/components/Toast";
import type { Route } from "./+types/admin.products_.new";

type AUProduct = z.infer<typeof AUProductSchema>;
type NZProduct = z.infer<typeof NZProductSchema>;

type SortOption = "default" | "price-asc" | "price-desc";

type LoaderData = {
  auProducts: AUProduct[];
  nzProducts: NZProduct[];
  error?: string;
};

type ActionData = 
  | { error: string; success?: never }
  | { success: string; error?: never }
  | null;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q");

  if (!searchTerm) {
    return Response.json({ auProducts: [], nzProducts: [] });
  }

  try {
    console.log("Searching for", searchTerm);
    const result = await searchWoolworths(searchTerm);
    
    if (result.error) {
      return Response.json(
        { 
          auProducts: [], 
          nzProducts: [], 
          error: result.error 
        },
        { status: 500 }
      );
    }

    const auProducts = result.au ?? [];
    const nzProducts = result.nz ?? [];

    return Response.json({ auProducts, nzProducts });
  } catch (error) {
    return Response.json(
      { 
        auProducts: [], 
        nzProducts: [], 
        error: error instanceof Error ? error.message : "Failed to search products" 
      },
      { status: 500 }
    );
  }
}

export async function action({
    request, context
  }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    switch (intent) {
      case "search":
        const q = formData.get("q");
        return redirect(`/admin/products/new?q=${q}`);
      case "match":
        const auProduct = JSON.parse(formData.get("auProduct") as string) as AUProduct;
        const nzProduct = JSON.parse(formData.get("nzProduct") as string) as NZProduct;
        const title = formData.get("title") as string;
        const categories = formData.getAll("categories");

        // Read price overrides (optional)
        const auPriceOverrideStr = formData.get("auPriceOverride") as string | null;
        const nzPriceOverrideStr = formData.get("nzPriceOverride") as string | null;

        // Determine final prices (use override if valid, otherwise original)
        const finalAuPrice = auPriceOverrideStr && !isNaN(parseFloat(auPriceOverrideStr)) 
                              ? parseFloat(auPriceOverrideStr) 
                              : auProduct.Price;
        const finalNzPrice = nzPriceOverrideStr && !isNaN(parseFloat(nzPriceOverrideStr))
                              ? parseFloat(nzPriceOverrideStr)
                              : nzProduct.price.salePrice;

        // Create modified product objects with potentially overridden prices
        const finalAuProduct = { ...auProduct, Price: finalAuPrice };
        const finalNzProduct = { 
          ...nzProduct, 
          price: { ...nzProduct.price, salePrice: finalNzPrice } 
        };

        for (const category of categories) {
          // Pass the potentially modified product objects to linkProducts
          await linkProducts(context.cloudflare.env, title, finalAuProduct, finalNzProduct, category as "value" | "quality" | "luxury")
        }

        return Response.json({ success: "Product matched successfully!" });
      default:
        console.error("Invalid intent", intent);
        return Response.json({ error: "Invalid intent" }, { status: 400 });
    }
}

export default function AdminProductMatching() {
  const navigation = useNavigation();
  const actionData = useActionData<ActionData>();
  const isMatching = navigation.state === "submitting" && navigation.formData?.get("intent") === "match";
  const isSearching = navigation.state === "loading" && 
                     navigation.location?.pathname === "/admin/products/new" &&
                     navigation.location?.search?.includes("q=")

  const { auProducts, nzProducts, error } = useLoaderData<LoaderData>();
  const [selectedAU, setSelectedAU] = useState<AUProduct | null>(null);
  const [selectedNZ, setSelectedNZ] = useState<NZProduct | null>(null);
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showUnavailable, setShowUnavailable] = useState<boolean>(true);

  // Add state for price overrides
  const [auPriceOverride, setAuPriceOverride] = useState<string>("");
  const [nzPriceOverride, setNzPriceOverride] = useState<string>("");

  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.success) {
      setToastMessage(actionData.success);
      setShowToast(true);
      setSelectedAU(null);
      setSelectedNZ(null);
      setSelectedCategories(new Set());
      setAuPriceOverride(""); // Clear override inputs
      setNzPriceOverride(""); // Clear override inputs
      if (searchInputRef.current) {
        searchInputRef.current.value = "";
      }
    } else if (actionData?.error) {
      setToastMessage(actionData.error);
      setShowToast(true);
    }
  }, [actionData]);

  const toggleCategory = (category: string) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
  };

  const sortedAuProducts = useMemo(() => {
    let filtered = auProducts;
    if (!showUnavailable) {
      filtered = filtered.filter(p => p.IsPurchasable);
    }
    if (sortBy === "default") return filtered;
    return [...filtered].sort((a, b) => {
      const priceA = a.Price ?? 0;
      const priceB = b.Price ?? 0;
      return sortBy === "price-asc" ? priceA - priceB : priceB - priceA;
    });
  }, [auProducts, sortBy, showUnavailable]);

  const sortedNzProducts = useMemo(() => {
    let filtered = nzProducts;
    if (!showUnavailable) {
      filtered = filtered.filter(p => p.availabilityStatus === 'In Stock');
    }
    if (sortBy === "default") return filtered;
    return [...filtered].sort((a, b) => {
      const priceA = a.price.salePrice ?? 0;
      const priceB = b.price.salePrice ?? 0;
      return sortBy === "price-asc" ? priceA - priceB : priceB - priceA;
    });
  }, [nzProducts, sortBy, showUnavailable]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Matching</h1>
      
      <div className="mb-4">
        <Form method="post" className="flex gap-2">
          <input type="hidden" name="intent" value="search"/>
          <input
            type="text"
            name="q"
            placeholder="Enter search term..."
            defaultValue={searchParams.get("q") ?? ""}
            className="flex-1 px-4 py-2 border rounded"
            ref={searchInputRef}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </Form>
      </div>

      {isSearching && (
        <div className="my-4 p-4 text-center text-gray-600">
            Searching for products...
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4 p-4 border rounded bg-gray-50 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1 border rounded text-sm"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
            <input 
                type="checkbox" 
                id="show-unavailable"
                checked={showUnavailable}
                onChange={(e) => setShowUnavailable(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <label htmlFor="show-unavailable" className="text-sm font-medium text-gray-700">Show unavailable products</label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* AU Products */}
        <div className="border rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Australian Products</h2>
          </div>
          <div className="space-y-2">
            {sortedAuProducts.map((product) => (
              <ProductMatchCard
                key={product.Stockcode}
                product={product}
                isSelected={selectedAU?.Stockcode === product.Stockcode}
                onClick={() => setSelectedAU(product)} 
              />
            ))}
          </div>
        </div>

        {/* NZ Products */}
        <div className="border rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">New Zealand Products</h2>
          </div>
          <div className="space-y-2">
            {sortedNzProducts.map((product) => (
              <ProductMatchCard
                key={product.sku}
                product={product}
                isSelected={selectedNZ?.sku === product.sku}
                onClick={() => setSelectedNZ(product)} 
              />
            ))}
          </div>
        </div>
      </div>

      {selectedAU && selectedNZ && (
        <div className="mt-4 flex flex-col items-center fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Form method="post" className="w-full max-w-2xl space-y-4">
            <input type="hidden" name="intent" value="match"/>
            <input type="hidden" name="auProduct" value={JSON.stringify(selectedAU)} />
            <input type="hidden" name="nzProduct" value={JSON.stringify(selectedNZ)} />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                required
                defaultValue={selectedAU.Name}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categories
              </label>
              <div className="flex gap-2">
                {["Value", "Quality", "Luxury"].map((category) => (
                  <label key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="categories"
                      value={category.toLowerCase()}
                      checked={selectedCategories.has(category.toLowerCase())}
                      onChange={() => toggleCategory(category.toLowerCase())}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Override Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    AU Price Override (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="auPriceOverride"
                    placeholder={`Current: $${selectedAU?.Price?.toFixed(2) ?? 'N/A'}`}
                    value={auPriceOverride}
                    onChange={(e) => setAuPriceOverride(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded text-sm"
                  />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NZ Price Override (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="nzPriceOverride"
                    placeholder={`Current: $${selectedNZ?.price.salePrice?.toFixed(2) ?? 'N/A'}`}
                    value={nzPriceOverride}
                    onChange={(e) => setNzPriceOverride(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded text-sm"
                  />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isMatching || selectedCategories.size === 0}
              >
                {isMatching ? "Matching..." : "Match Selected Products"}
              </button>
            </div>
          </Form>
        </div>
      )}

      <Toast 
        message={toastMessage} 
        type={actionData?.success ? 'success' : 'error'}
        show={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
} 