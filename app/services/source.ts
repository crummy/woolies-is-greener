// import { Product } from "kysely-codegen";

export function auLink(auStockcode: string) {
    return `https://www.woolworths.com.au/shop/productdetails/${auStockcode}`;
}

export function nzLink(nzSku: string) {
    return `https://www.woolworths.co.nz/shop/productdetails?stockcode=${nzSku}`;
}
