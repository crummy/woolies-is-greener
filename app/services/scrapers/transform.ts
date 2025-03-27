import { z } from "zod";
import {
    AUSearchResponseSchema,
    NZSearchResponseSchema,
} from "../../types/api.ts";
import {
    type Product,
    type ProductCategory,
    type ScrapedProduct,
} from "../../types/product.ts";

// Helper function to determine product category from name and description
function determineCategory(name: string, description: string): ProductCategory {
    const lowerName = name.toLowerCase();
    const lowerDesc = description.toLowerCase();

    if (
        lowerName.includes("milk") || lowerName.includes("cheese") ||
        lowerName.includes("yogurt")
    ) {
        return "Dairy";
    }
    if (
        lowerName.includes("fruit") || lowerName.includes("vegetable") ||
        lowerName.includes("produce")
    ) {
        return "Produce";
    }
    if (
        lowerName.includes("bread") || lowerName.includes("biscuit") ||
        lowerName.includes("cake")
    ) {
        return "Bakery";
    }
    if (
        lowerName.includes("meat") || lowerName.includes("chicken") ||
        lowerName.includes("beef") || lowerName.includes("fish")
    ) {
        return "Meat & Seafood";
    }
    if (
        lowerName.includes("snack") || lowerName.includes("chocolate") ||
        lowerName.includes("candy")
    ) {
        return "Snacks";
    }
    if (
        lowerName.includes("drink") || lowerName.includes("beverage") ||
        lowerName.includes("juice")
    ) {
        return "Beverages";
    }
    if (
        lowerName.includes("household") || lowerName.includes("cleaning") ||
        lowerName.includes("paper")
    ) {
        return "Household";
    }
    return "Pantry"; // default category
}

// Helper function to determine bucket from name and description
function determineBucket(name: string, description: string): string {
    const lowerName = name.toLowerCase();
    const lowerDesc = description.toLowerCase();

    // Common buckets based on the design doc
    if (lowerName.includes("weetbix") || lowerName.includes("cereal")) {
        return "Breakfast Cereal";
    }
    if (lowerName.includes("milk")) {
        return "Milk";
    }
    if (lowerName.includes("bread")) {
        return "Bread";
    }
    if (lowerName.includes("egg")) {
        return "Eggs";
    }
    // Add more buckets as needed
    return "Other";
}

// Helper function to determine if products match exactly
function areExactMatches(nz: ScrapedProduct, au: ScrapedProduct): boolean {
    // Compare normalized names (remove size/weight info)
    const nzName = nz.name.replace(/\d+(\.\d+)?\s*(kg|g|ml|l)/i, "").trim();
    const auName = au.name.replace(/\d+(\.\d+)?\s*(kg|g|ml|l)/i, "").trim();

    // Compare brands
    const nzBrand = nz.brand.toLowerCase();
    const auBrand = au.brand.toLowerCase();

    return nzName === auName && nzBrand === auBrand;
}

// Transform NZ product to our format
function transformNZProduct(
    nzProduct: z.infer<typeof NZSearchResponseSchema>["products"]["items"][0],
): ScrapedProduct {
    return {
        name: nzProduct.name,
        description: nzProduct.name, // NZ API doesn't provide descriptions in search
        imageUrl: nzProduct.images.big,
        price: nzProduct.price.salePrice,
        size: nzProduct.size.volumeSize,
        brand: nzProduct.brand,
        sku: nzProduct.sku,
        barcode: nzProduct.barcode,
    };
}

// Transform AU product to our format
function transformAUProduct(
    auProduct: z.infer<
        typeof AUSearchResponseSchema
    >["Products"][0]["Products"][0],
): ScrapedProduct {
    return {
        name: auProduct.Name,
        description: auProduct.Description,
        imageUrl: auProduct.LargeImageFile,
        price: auProduct.Price,
        size: auProduct.PackageSize,
        brand: auProduct.Brand,
        sku: auProduct.Stockcode.toString(),
        barcode: auProduct.Barcode,
    };
}

export function transformToProducts(
    nzData: z.infer<typeof NZSearchResponseSchema>,
    auData: z.infer<typeof AUSearchResponseSchema>,
): Product[] {
    const products: Product[] = [];

    // Transform NZ products
    const nzProducts = nzData.products.items.map(transformNZProduct);
    console.log({ nz: nzProducts });

    // Transform AU products
    const auProducts = auData.Products.flatMap((group) =>
        group.Products.map(transformAUProduct)
    );
    console.log({ au: auProducts.map((n) => n.name) });

    // Match products and create our format
    for (const nzProduct of nzProducts) {
        // Find matching AU product
        const matchingAU = auProducts.find((au) =>
            areExactMatches(nzProduct, au)
        );

        if (matchingAU) {
            const category = determineCategory(
                nzProduct.name,
                nzProduct.description,
            );
            const bucket = determineBucket(
                nzProduct.name,
                nzProduct.description,
            );

            products.push({
                id: `${nzProduct.sku}-${matchingAU.sku}`, // Create unique ID from both SKUs
                name: nzProduct.name,
                description: matchingAU.description || nzProduct.description,
                imageUrl: nzProduct.imageUrl,
                category,
                bucket,
                exactMatch: true,
                nzPrice: nzProduct.price,
                auPrice: matchingAU.price,
                basketTypes: [], // This would need to be determined by business logic
            });
        }
    }

    return products;
}
