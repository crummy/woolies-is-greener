import { z } from "zod";

export const BasketType = z.enum(["Basic", "Standard", "Luxury"]);
export type BasketType = z.infer<typeof BasketType>;

export const ProductCategory = z.enum([
    "Dairy",
    "Produce",
    "Bakery",
    "Meat & Seafood",
    "Pantry",
    "Snacks",
    "Beverages",
    "Household",
]);
export type ProductCategory = z.infer<typeof ProductCategory>;

export const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    imageUrl: z.string().url(),
    category: ProductCategory,
    bucket: z.string(),
    exactMatch: z.boolean(),
    nzPrice: z.number(),
    auPrice: z.number(), // stored in AUD
    basketTypes: z.array(BasketType),
});

export type Product = z.infer<typeof ProductSchema>;

// Helper type for the transformation process
export interface ScrapedProduct {
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    size?: string;
    brand: string;
    sku: string;
    barcode: string;
}
