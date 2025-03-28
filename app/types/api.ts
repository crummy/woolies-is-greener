import { z } from "zod";

// Common types used across both NZ and AU APIs
const PriceSchema = z.object({
    originalPrice: z.number(),
    salePrice: z.number(),
    savePrice: z.number(),
    savePercentage: z.number(),
    canShowSavings: z.boolean(),
    hasBonusPoints: z.boolean(),
    isClubPrice: z.boolean(),
    isSpecial: z.boolean(),
    isNew: z.boolean(),
    canShowOriginalPrice: z.boolean(),
});

const SizeSchema = z.object({
    cupListPrice: z.number(),
    cupPrice: z.number(),
    cupMeasure: z.string(),
    packageType: z.string().nullable(),
    volumeSize: z.string(),
});

const QuantitySchema = z.object({
    min: z.number(),
    max: z.number(),
    increment: z.number(),
    value: z.number().nullable(),
    quantityInOrder: z.number().nullable(),
    purchasingQuantityString: z.string().nullable(),
});

// New Zealand API Types
export const NZProductSchema = z.object({
    type: z.literal("Product"),
    name: z.string(),
    barcode: z.string(),
    variety: z.string().nullable(),
    brand: z.string(),
    slug: z.string(),
    sku: z.string(),
    unit: z.string(),
    selectedPurchasingUnit: z.null(),
    price: PriceSchema,
    images: z.object({
        small: z.string().url(),
        big: z.string().url(),
    }),
    quantity: QuantitySchema,
    stockLevel: z.number(),
    eachUnitQuantity: z.null(),
    averageWeightPerUnit: z.null(),
    size: SizeSchema,

    hasShopperNotes: z.null(),
    productTag: z.object({
        tagType: z.string(),
        multiBuy: z.null(),
        bonusPoints: z.null(),
        targetedOffer: z.null(),
        boostOffer: z.null(),
    }).nullable(),
    departments: z.array(z.object({
        id: z.number(),
        name: z.string(),
    })),
    subsAllowed: z.boolean(),
    supportsBothEachAndKgPricing: z.boolean(),
    adId: z.null(),
    brandSuggestionId: z.null(),
    brandSuggestionName: z.null(),
    priceUnitLabel: z.null(),
    availabilityStatus: z.string(),
    onlineSample: z.null(),
    onlineSampleRealProductMapId: z.number(),
});

export const NZSearchResponseSchema = z.object({
    products: z.object({
        items: z.array(NZProductSchema),
    }),
});

// Australia API Types
export const AUProductSchema = z.object({
    TileID: z.number(),
    Stockcode: z.number(),
    Barcode: z.string().nullable(),
    GtinFormat: z.number(),
    CupPrice: z.number().nullable(),
    InstoreCupPrice: z.number().nullable(),
    CupMeasure: z.string(),
    CupString: z.string(),
    InstoreCupString: z.string(),
    HasCupPrice: z.boolean(),
    InstoreHasCupPrice: z.boolean(),
    Price: z.number().nullable(), // null if sold out
    InstorePrice: z.number().nullable(), // null if sold out
    Name: z.string(),
    DisplayName: z.string(),
    UrlFriendlyName: z.string(),
    Description: z.string(),
    SmallImageFile: z.string().url(),
    MediumImageFile: z.string().url(),
    LargeImageFile: z.string().url(),
    WasPrice: z.number(),
    Unit: z.string(),
    MinimumQuantity: z.number(),
    PackageSize: z.string(),
    UnitWeightInGrams: z.number(),
    SmallFormatDescription: z.string(),
    FullDescription: z.string(),
    IsAvailable: z.boolean(),
    IsPurchasable: z.boolean(),
    DisplayQuantity: z.number(),
    SapCategories: z.null(),
    Brand: z.string(),
    AdditionalAttributes: z.record(z.unknown()),
    DetailsImagePaths: z.array(z.string().url()),
    Variety: z.string().nullable(),
    Rating: z.record(z.unknown()),
});

export const AUSearchResponseSchema = z.object({
    Products: z.array(z.object({
        Products: z.array(AUProductSchema),
        Name: z.string(),
        DisplayName: z.string(),
    })),
    SearchResultsCount: z.number(),
});

// Schema.org Product Type (used in AU product details)
export const SchemaOrgProductSchema = z.object({
    "@context": z.literal("http://schema.org"),
    "@type": z.literal("Product"),
    name: z.string(),
    description: z.string(),
    image: z.string().url(),
    brand: z.object({
        "@type": z.literal("Organization"),
        name: z.string(),
    }),
    gtin13: z.string(),
    offers: z.object({
        "@type": z.literal("Offer"),
        availability: z.string(),
        itemCondition: z.string(),
        price: z.number(),
        priceCurrency: z.string(),
    }),
    sku: z.string(),
});
