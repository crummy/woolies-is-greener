import { Product } from "kysely-codegen";

export function auLink(product: Pick<Product, "auStockcode">) {
    return `https://www.woolworths.com.au/shop/productdetails/${product.auStockcode}`;
}

export function nzLink(product: Pick<Product, "nzSku">) {
    return `https://www.woolworths.co.nz/shop/productdetails?stockcode=${product.nzSku}`;
}
