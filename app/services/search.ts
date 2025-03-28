import { z } from "zod";
import {
    AUProductSchema,
    AUSearchResponseSchema,
    NZProductSchema,
    NZSearchResponseSchema,
} from "~/types/api";

const NZ_BASE_URL = "https://www.woolworths.co.nz";
const AU_BASE_URL = "https://www.woolworths.com.au";

const NZ_HEADERS = {
    "accept": "application/json",
    "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    "x-requested-with": "OnlineShopping.WebApp",
};

const AU_HEADERS = {
    "accept": "application/json",
    "content-type": "application/json",
    "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
};

interface SearchResult {
    nz: z.infer<typeof NZProductSchema>[];
    au: z.infer<typeof AUProductSchema>[];
    error?: string;
}

export async function searchWoolworths(query: string): Promise<SearchResult> {
    const result: SearchResult = { nz: [], au: [] };

    try {
        // Search NZ site
        const nzResponse = await fetch(
            `${NZ_BASE_URL}/api/v1/products?target=search&search=${
                encodeURIComponent(query)
            }&inStockProductsOnly=false&size=48`,
            { headers: NZ_HEADERS },
        );

        if (!nzResponse.ok) {
            throw new Error(`NZ API returned ${nzResponse.status}`);
        }

        const nzData = await nzResponse.json() as {
            products: { items: { type: string }[] };
        };

        // Parse each product individually
        result.nz = nzData.products.items.filter((p) => p.type === "Product")
            .map((item) => {
                try {
                    return NZProductSchema.parse(item);
                } catch (error) {
                    console.error("Failed to parse NZ product:", {
                        product: item,
                        error: error instanceof Error
                            ? error.message
                            : String(error),
                    });
                    return null;
                }
            }).filter((product): product is z.infer<typeof NZProductSchema> =>
                product !== null
            );
    } catch (error) {
        result.error = `NZ search failed: ${
            error instanceof Error ? error.message : String(error)
        }`;
    }

    try {
        // Search AU site
        const root = await fetch(AU_BASE_URL);
        if (!root.ok) {
            throw new Error(`AU root returned ${root.status}`);
        }

        const cookies = root.headers.get("set-cookie");
        const abck = cookies?.split(", ").find((cookie) =>
            cookie.startsWith("_abck")
        );
        if (!abck) {
            throw new Error("No _abck cookie found");
        }

        const auResponse = await fetch(
            `${AU_BASE_URL}/apis/ui/Search/products`,
            {
                method: "POST",
                headers: { ...AU_HEADERS, cookie: abck },
                body: JSON.stringify({
                    Filters: [],
                    IsSpecial: false,
                    Location: `/shop/search/products?searchTerm=${
                        encodeURIComponent(query)
                    }`,
                    PageNumber: 1,
                    PageSize: 24,
                    SearchTerm: query,
                    SortType: "TraderRelevance",
                    IsRegisteredRewardCardPromotion: null,
                    ExcludeSearchTypes: ["UntraceableVendors"],
                    GpBoost: 0,
                    GroupEdmVariants: true,
                    EnableAdReRanking: false,
                    flags: {
                        EnableProductBoostExperiment: false,
                    },
                }),
            },
        );

        if (!auResponse.ok) {
            throw new Error(`AU API returned ${auResponse.status}`);
        }

        const auData = await auResponse.json();
        const parsedResponse = AUSearchResponseSchema.parse(auData);

        // Parse each product individually
        result.au = parsedResponse.Products.flatMap((group) => {
            return group.Products.map((product) => {
                try {
                    return AUProductSchema.parse(product);
                } catch (error) {
                    console.error("Failed to parse AU product:", {
                        product,
                        error: error instanceof Error
                            ? error.message
                            : String(error),
                    });
                    return null;
                }
            }).filter((product): product is z.infer<typeof AUProductSchema> =>
                product !== null
            );
        });
    } catch (error) {
        result.error = `${
            result.error ? result.error + "\n" : ""
        }AU search failed: ${
            error instanceof Error ? error.message : String(error)
        }`;
    }

    return result;
}
