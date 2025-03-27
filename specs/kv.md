# NZ vs AU Woolworths Price Comparison App: KV Store Structure

## Core KV Structures

### 1. Products

- Key: `product:{id}` (e.g., `product:123`)
- Value: JSON object containing:
  ```json
  {
      "id": "123",
      "name": "Cage-Free Size 7 Eggs (Dozen)",
      "description": "Farm fresh cage-free eggs",
      "imageUrl": "https://example.com/eggs.jpg",
      "categoryId": "eggs",
      "nzPrice": 5.99,
      "auPrice": 4.89,
      "basketIds": ["quality"],
      "updatedAt": "2025-03-26T22:29:45.367Z"
  }
  ```

### 2. Categories

- Key: `category:{id}` (e.g., `category:eggs`)
- Value: JSON object with:
  ```json
  {
      "id": "eggs",
      "name": "Eggs",
      "description": "Fresh eggs",
      "displayOrder": 3
  }
  ```

### 3. Baskets

- Key: `basket:{id}` (e.g., `basket:value`)
- Value: JSON object with:
  ```json
  {
      "id": "value",
      "name": "Value Basket",
      "description": "Basic essentials at lowest prices"
  }
  ```

## Additional Recommended KV Structures

### 4. Index Lists

- `products:all` - List of all product IDs
- `category:{id}:products` - List of product IDs in a category
- `basket:{id}:products` - List of product IDs in a basket

These index lists help with quick lookups without having to scan all products.

### 5. Metadata

- Key: `metadata:currency_exchange`
- Value: JSON with exchange rate data and last updated timestamp:
  ```json
  {
      "nzdToAud": 0.92,
      "audToNzd": 1.09,
      "last_updated": "2025-03-27T12:00:00Z"
  }
  ```

### 6. Comparison Summaries

- Key: `summary:basket:{id}`
- Value: Pre-calculated summary data for each basket:
  ```json
  {
      "basketId": "value",
      "nzTotal": 87.45,
      "auTotal": 81.22,
      "differencePercentage": -7.1,
      "cheaperCountry": "au"
  }
  ```

## Implementation Considerations

### 1. Atomic Updates

KV stores don't support transactions, so keep related data in single values
where possible.

### 2. Denormalization

Consider duplicating some data for performance. For example, storing product IDs
in both category lists and basket lists.

### 3. Pagination

For lists that might grow large, plan for pagination using list prefixes and
limiting query results.

### 4. Key Namespacing

Use consistent prefixes (`product:`, `category:`, etc.) to organize your keys
and avoid collisions.

### 5. Data Size Limits

Cloudflare KV has a 25MB limit per value, but for performance, keep values under
10KB when possible.

### 6. Naming convention

IDs should be UUIDs.

Keys should be camelCase.
