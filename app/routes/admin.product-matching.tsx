import { useState } from "react";
import type { AUProductSchema, NZProductSchema, NZSearchResponseSchema } from "~/types/api";
import { z } from "zod";
import { searchWoolworths } from "~/services/scrapers/search";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";

type AUProduct = z.infer<typeof AUProductSchema>;
type NZProduct = z.infer<typeof NZSearchResponseSchema>["products"]["items"][0];

type LoaderData = {
  auProducts: AUProduct[];
  nzProducts: NZProduct[];
  error?: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q");

  if (!searchTerm) {
    return json({ auProducts: [], nzProducts: [] });
  }

  try {
    console.log("Searching for", searchTerm);
    const result = await searchWoolworths(searchTerm);
    
    if (result.error) {
      return json(
        { 
          auProducts: [], 
          nzProducts: [], 
          error: result.error 
        },
        { status: 500 }
      );
    }

    const auProducts = result.au ? result.au.Products.flatMap(group => group.Products) : [];
    const nzProducts = result.nz ? result.nz.products.items : [];

    return json({ auProducts, nzProducts });
  } catch (error) {
    return json(
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
    request,
  }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    switch (intent) {
      case "search":
        const q = formData.get("q");
        return redirect(`/admin/product-matching?q=${q}`);
      case "match":
        const auProduct = JSON.parse(formData.get("auProduct") as string) as AUProduct;
        const nzProduct = JSON.parse(formData.get("nzProduct") as string) as NZProduct;
        return null;
      default:
        console.error("Invalid intent", intent);
        return json({ error: "Invalid intent" }, { status: 400 });
    }
}

export default function AdminProductMatching() {
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/recipes/new";
  const { auProducts, nzProducts, error } = useLoaderData<LoaderData>();
  const [selectedAU, setSelectedAU] = useState<AUProduct | null>(null);
  const [selectedNZ, setSelectedNZ] = useState<NZProduct | null>(null);
  const [searchParams] = useSearchParams()

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
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </Form>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* AU Products */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Australian Products</h2>
          <div className="space-y-2">
            {auProducts.map((product) => (
              <div
                key={product.Stockcode}
                className={`p-2 border rounded cursor-pointer ${
                  selectedAU?.Stockcode === product.Stockcode
                    ? "border-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedAU(product)}
              >
                <div className="flex items-start gap-2">
                  <img
                    src={product.SmallImageFile}
                    alt={product.Name}
                    className="w-16 h-16 object-contain"
                  />
                  <div>
                    <h3 className="font-medium">{product.Name}</h3>
                    <p className="text-sm text-gray-600">{product.DisplayName}</p>
                    <p className="text-sm font-medium">${product.Price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NZ Products */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">New Zealand Products</h2>
          <div className="space-y-2">
            {nzProducts.map((product) => (
              <div
                key={product.sku}
                className={`p-2 border rounded cursor-pointer ${
                  selectedNZ?.sku === product.sku
                    ? "border-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedNZ(product)}
              >
                <div className="flex items-start gap-2">
                  <img
                    src={product.images.small}
                    alt={product.name}
                    className="w-16 h-16 object-contain"
                  />
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.size.volumeSize}</p>
                    <p className="text-sm font-medium">${product.price.salePrice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedAU && selectedNZ && (
        <div className="mt-4 flex justify-center fixed bottom-0 w-full p-4">
          <Form method="post">
          <input type="hidden" name="intent" value="match"/>
            <input type="hidden" name="auProduct" value={JSON.stringify(selectedAU)} />
            <input type="hidden" name="nzProduct" value={JSON.stringify(selectedNZ)} />
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={isSubmitting}
            >
              Match Selected Products
            </button>
          </Form>
        </div>
      )}
    </div>
  );
} 