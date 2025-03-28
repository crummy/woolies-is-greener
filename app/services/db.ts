import { AUProduct, Basket, NZProduct } from "~/types/types";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { DB } from "kysely-codegen";
import { ulid } from "./ulid";

const productId = () => `p_${ulid()}`;

const basketProductId = () => `bp_${ulid()}`;

export async function linkProducts(
    env: Env,
    title: string,
    auProduct: AUProduct,
    nzProduct: NZProduct,
    basket: "value" | "quality" | "luxury",
) {
    const db = new Kysely<DB>({
        dialect: new D1Dialect({ database: env.DB }),
    });

    const productRow = await db.insertInto("product").values({
        id: productId(),
        title: title,
        nzPrice: nzProduct.price.salePrice,
        nzPriceOriginal: nzProduct.price.originalPrice,
        auPrice: auProduct.Price,
        auPriceOriginal: auProduct.WasPrice,
        nzSku: nzProduct.sku,
        auStockcode: auProduct.Stockcode.toString(),
        imageUrl: nzProduct.images.big,
        updated: new Date().toISOString(),
    }).executeTakeFirst();

    const basketRow = await db.selectFrom("basket").selectAll().where(
        "name",
        "=",
        basket,
    ).executeTakeFirst();
    if (!basket) {
        throw new Error(`Basket ${basket} not found`);
    }

    await db.insertInto("basket_product").values({
        id: basketProductId(),
        basketId: basketRow.id,
        productId: productRow.id,
    });
}

async function getAllProducts(
    env: Env,
    basket: "value" | "quality" | "luxury",
) {
    const db = new Kysely<DB>({
        dialect: new D1Dialect({ database: env.DB }),
    });

    return await db.selectFrom("product")
        .leftJoin("basket_product", "basket_product.productId", "product.id")
        .leftJoin("basket", "basket.id", "basket_product.basketId")
        .where("basket.name", "=", basket)
        .selectAll()
        .execute();
}
export type Product = {
    title: string;
    auPrice: number;
    auOriginalPrice: number;
    nzPrice: number;
    nzOriginalPrice: number;
    sku: string;
    unit: string;
    updated: string;
};
