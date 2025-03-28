-- Migration number: 0001 	 2025-03-28T08:44:28.327Z

CREATE TABLE IF NOT EXISTS product (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    nzPrice INTEGER NOT NULL,
    nzPriceOriginal INTEGER NOT NULL,
    auPrice INTEGER NOT NULL,
    auPriceOriginal INTEGER NOT NULL,
    nzSku TEXT NOT NULL,
    auStockcode TEXT NOT NULL,
    imageUrl TEXT,
    updated TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS basket (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS basket_product (
    id TEXT PRIMARY KEY,
    basketId TEXT NOT NULL,
    productId TEXT NOT NULL,
    FOREIGN KEY (basketId) REFERENCES basket(id),
    FOREIGN KEY (productId) REFERENCES product(id)
);

