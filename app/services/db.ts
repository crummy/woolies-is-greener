import type { AUProduct, NZProduct } from '~/types/types';
import { Kysely, sql } from 'kysely';
import { SqliteDialect } from 'kysely';
import type { Basket, DB, Product } from 'kysely-codegen';
import { ulid } from './ulid';
// Adding better-sqlite3 type declaration
// @ts-ignore
import SQLite from 'better-sqlite3';

const dialect = new SqliteDialect({
  database: new SQLite('db.sqlite'),
});
// Helper function to create a database connection
export function getDb(): Kysely<DB> {
  return new Kysely<DB>({
    dialect,
  });
}

// ID generation helpers
export const generateProductId = () => `p_${ulid()}`;
export const generateBasketId = () => `b_${ulid()}`;
export const generateBasketProductId = () => `bp_${ulid()}`;

// Basket operations
export async function getAllBaskets() {
  const db = getDb();
  return await db.selectFrom('basket').selectAll().execute();
}

export async function getBasketById(id: string) {
  const db = getDb();
  return await db.selectFrom('basket').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function getBaskets() {
  const db = getDb();
  return await db.selectFrom('basket').select(['id', 'name', 'description']).execute();
}

export async function createBasket(name: string, description: string) {
  const db = getDb();
  const id = generateBasketId();
  await db
    .insertInto('basket')
    .values({
      id,
      name,
      description,
    })
    .execute();
  return id;
}

export async function deleteBasket(id: string) {
  const db = getDb();
  await db.deleteFrom('basket').where('id', '=', id).execute();
}

// Product operations
export async function getProductsWithBaskets(selectedBasketId?: string | null) {
  const db = getDb();

  // Fetch products and aggregate basket info (id:name)
  const productsData = await db
    .selectFrom('product')
    .leftJoin('basket_product', 'basket_product.productId', 'product.id')
    .leftJoin('basket', 'basket.id', 'basket_product.basketId')
    .selectAll('product')
    // Concatenate ID and Name, separated by a colon, rows separated by comma
    .$call((qb) =>
      qb.select(sql<string | null>`GROUP_CONCAT(basket.id || ':' || basket.name)`.as('basketInfo'))
    )
    .groupBy('product.id')
    .execute();

  // Process the result to create the baskets array with IDs and names
  const processedProducts = productsData.map((productRow) => {
    const { basketInfo, ...productFields } = productRow;
    const baskets = basketInfo
      ? (basketInfo
          .split(',')
          .map((info) => {
            // Find the first colon to split, handle names containing colons
            const colonIndex = info.indexOf(':');
            if (colonIndex === -1) return null; // Malformed data?
            const id = info.substring(0, colonIndex);
            const name = info.substring(colonIndex + 1);
            return { id, name };
          })
          .filter(Boolean) as { id: string; name: string }[]) // Filter out any nulls from malformed data
      : [];

    return {
      ...productFields,
      baskets,
    };
  });

  // Filter products if a basketId is selected
  if (selectedBasketId) {
    return processedProducts.filter((p) => p.baskets.some((b) => b.id === selectedBasketId));
  }

  return processedProducts;
}

export async function getProductsByBasketName(basketName: string | null) {
  const db = getDb();

  // Get all baskets first
  const allBaskets = await db.selectFrom('basket').select(['id', 'name', 'description']).execute();

  // Find the selected basket by name (case-insensitive)
  let selectedBasket: Pick<Basket, 'id' | 'name' | 'description'> | undefined;
  if (basketName) {
    selectedBasket = allBaskets.find((b) => b.name.toLowerCase() === basketName.toLowerCase());
  }

  // Determine default/fallback basket if needed
  if (!selectedBasket && allBaskets.length > 0) {
    // Try to default to "Value Basket" by name
    selectedBasket = allBaskets.find((b) => b.name.toLowerCase() === 'value basket');
    // If "Value Basket" not found, default to the first basket
    if (!selectedBasket) {
      selectedBasket = allBaskets[0];
    }
  }

  // Use the ID of the found/default basket
  const selectedBasketId = selectedBasket?.id;
  if (!selectedBasketId) {
    throw new Error('No basket selected or found');
  }

  // Get products in the selected basket
  const productsInBasket = await db
    .selectFrom('product')
    .innerJoin('basket_product', 'basket_product.productId', 'product.id')
    .where('basket_product.basketId', '=', selectedBasketId)
    .select([
      'product.id',
      'product.title',
      'product.auPrice',
      'product.nzPrice',
      'product.auStockcode',
      'product.nzSku',
    ])
    .execute();

  return {
    allBaskets,
    selectedBasketId,
    productsInBasket,
  };
}

export async function deleteProduct(id: string) {
  const db = getDb();
  await db.deleteFrom('product').where('id', '=', id).executeTakeFirstOrThrow();
}

export async function getProductDetails(productId: string) {
  const db = getDb();

  // Fetch product, all baskets, and current product basket IDs in parallel
  const [productResult, allBasketsResult, currentLinksResult] = await Promise.allSettled([
    db.selectFrom('product').selectAll().where('id', '=', productId).executeTakeFirst(),
    db.selectFrom('basket').select(['id', 'name', 'description']).execute(),
    db.selectFrom('basket_product').select('basketId').where('productId', '=', productId).execute(),
  ]);

  // Check results carefully using Promise.allSettled
  if (productResult.status === 'rejected' || !productResult.value) {
    throw new Error('Product not found');
  }
  if (allBasketsResult.status === 'rejected') {
    throw new Error('Failed to load baskets');
  }
  if (currentLinksResult.status === 'rejected') {
    throw new Error('Failed to load current basket links');
  }

  const product = productResult.value;
  const allBaskets = allBasketsResult.value;
  const currentLinks = currentLinksResult.value;

  const selectedBasketIds = new Set(currentLinks.map((link) => link.basketId));

  return {
    product,
    allBaskets,
    selectedBasketIds,
  };
}

export async function updateProduct(
  productId: string,
  productData: {
    title: string;
    nzPrice: number;
    nzPriceOriginal: number;
    auPrice: number;
    auPriceOriginal: number;
    nzSku: string;
    auStockcode: string;
    imageUrl: string | null;
  },
  submittedBasketIds: Set<string>
) {
  const db = getDb();

  try {
    // 1. Update product details
    await db
      .updateTable('product')
      .set({
        title: productData.title,
        nzPrice: productData.nzPrice,
        nzPriceOriginal: productData.nzPriceOriginal,
        auPrice: productData.auPrice,
        auPriceOriginal: productData.auPriceOriginal,
        nzSku: productData.nzSku,
        auStockcode: productData.auStockcode,
        imageUrl: productData.imageUrl,
        updated: new Date().toISOString(),
      })
      .where('id', '=', productId)
      .executeTakeFirstOrThrow();

    // 2. Get current basket associations for this product
    const currentLinks = await db
      .selectFrom('basket_product')
      .select('basketId')
      .where('productId', '=', productId)
      .execute();
    const currentBasketIds = new Set(currentLinks.map((link) => link.basketId));

    // 3. Calculate differences
    const idsToAdd = [...submittedBasketIds].filter((id) => !currentBasketIds.has(id));
    const idsToRemove = [...currentBasketIds].filter((id) => !submittedBasketIds.has(id));

    // 4. Remove old links
    if (idsToRemove.length > 0) {
      await db
        .deleteFrom('basket_product')
        .where('productId', '=', productId)
        .where('basketId', 'in', idsToRemove)
        .execute();
    }

    // 5. Add new links
    if (idsToAdd.length > 0) {
      const newLinks = idsToAdd.map((basketId) => ({
        id: generateBasketProductId(),
        productId: productId,
        basketId: basketId,
      }));
      await db.insertInto('basket_product').values(newLinks).execute();
    }
  } catch (error) {
    console.error('Failed to update product and/or baskets:', error);
    throw error;
  }
}

export async function linkProducts(
  title: string,
  auProduct: AUProduct,
  nzProduct: NZProduct,
  basket: 'value' | 'quality' | 'luxury'
) {
  const db = getDb();

  if (auProduct.Price === null) {
    throw new Error('AU product price is null');
  }

  let newProductId = generateProductId();
  const productRow = await db
    .insertInto('product')
    .values({
      id: newProductId,
      title: title,
      nzPrice: nzProduct.price.salePrice,
      nzPriceOriginal: nzProduct.price.originalPrice,
      auPrice: auProduct.Price,
      auPriceOriginal: auProduct.WasPrice,
      nzSku: nzProduct.sku,
      auStockcode: auProduct.Stockcode.toString(),
      imageUrl: nzProduct.images.big,
      updated: new Date().toISOString(),
    })
    .executeTakeFirst();
  if (!productRow.insertId) {
    throw new Error('Failed to insert product');
  }

  const basketRow = await db
    .selectFrom('basket')
    .selectAll()
    .where('name', '=', basket)
    .executeTakeFirst();
  if (!basketRow?.id) {
    throw new Error(`Basket ${basket} not found`);
  }

  await db
    .insertInto('basket_product')
    .values({
      id: generateBasketProductId(),
      basketId: basketRow.id,
      productId: newProductId,
    })
    .execute();
}
