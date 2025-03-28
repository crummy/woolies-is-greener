import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const product = sqliteTable("product", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    nzPrice: integer("nzPrice").notNull(),
    nzPriceOriginal: integer("nzPriceOriginal").notNull(),
    auPrice: integer("auPrice").notNull(),
    auPriceOriginal: integer("auPriceOriginal").notNull(),
    nzSku: text("nzSku").notNull(),
    auStockcode: text("auStockcode").notNull(),
    imageUrl: text("imageUrl"),
    updated: text("updated").notNull(),
});

export const basket = sqliteTable("basket", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
});

export const basketProduct = sqliteTable("basket_product", {
    id: text("id").primaryKey(),
    basketId: text("basketId")
        .notNull()
        .references(() => basket.id),
    productId: text("productId")
        .notNull()
        .references(() => product.id),
});
