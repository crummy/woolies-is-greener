import { z } from "zod";
import {
    AUSearchResponseSchema,
    NZSearchResponseSchema,
} from "../../types/api.ts";
import { transformToProducts } from "./transform.ts";

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
    nz?: z.infer<typeof NZSearchResponseSchema>;
    au?: z.infer<typeof AUSearchResponseSchema>;
    error?: string;
}

export async function searchWoolworths(query: string): Promise<SearchResult> {
    const result: SearchResult = {};

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

        const nzData = await nzResponse.json();
        result.nz = NZSearchResponseSchema.parse(nzData);
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
        result.au = AUSearchResponseSchema.parse(auData);
    } catch (error) {
        result.error = `${
            result.error ? result.error + "\n" : ""
        }AU search failed: ${
            error instanceof Error ? error.message : String(error)
        }`;
    }

    return result;
}

// Script entry point
async function main() {
    const query = process.argv[2] || "weetbix";
    console.log(`Searching for "${query}"...`);

    const result = await searchWoolworths(query);

    if (result.error) {
        console.error("Errors:", result.error);
    }

    if (result.nz && result.au) {
        const products = transformToProducts(result.nz, result.au);
        console.log(
            "\nTransformed Products:",
            JSON.stringify(products, null, 2),
        );
    } else {
        console.log("\nRaw Results:");
        if (result.nz) {
            console.log("\nNZ Results:", JSON.stringify(result.nz, null, 2));
        }
        if (result.au) {
            console.log("\nAU Results:", JSON.stringify(result.au, null, 2));
        }
    }
}

main().catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
});
