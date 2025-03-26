# NZ vs AU Woolworths Price Comparison Web App: Design Document

## 1. Project Overview

### 1.1 Purpose

To create a web application that compares grocery prices between Woolworths in
New Zealand and Australia, allowing users to see which country has more
affordable groceries overall.

### 1.2 Target Audience

General public, particularly those interested in cost of living comparisons
between NZ and Australia.

### 1.3 Key Features

- Comparison of equivalent products between NZ and AU Woolworths
- Three predefined shopping basket types (Basic, Standard, Luxury)
- Simple numerical price differences with currency conversion
- Product images and brief descriptions

## 2. Data Structure

### 2.1 Product Model

```
Product {
  id: unique_identifier
  name: string
  description: string
  image_url: string
  category: string (e.g., "Dairy", "Produce", "Bakery")
  bucket: string (e.g., "Eggs", "Milk", "Bread")
  exact_match: boolean (true if exact match, false if similar product)
  nz_price: decimal
  au_price: decimal (stored in AUD)
  basket_types: array ["Basic", "Standard", "Luxury"] (which baskets this product appears in)
}
```

### 2.2 Basket Definitions

Three predefined baskets:

1. Basic: Essential, lowest-cost items (cheap eggs, basic vegetables, house
   brand products)
2. Standard: Common household items of mid-range quality/price
3. Luxury: Premium versions of products (organic, free-range, specialty items)

### 2.3 Product Matching Strategy

- For exact matches (e.g., 1.2kg Weetbix): Direct comparison with same product
  in both countries
- For similar products (e.g., eggs): Comparison within the same "bucket" with
  clear labeling of differences
- Products with no equivalent will not be displayed

## 3. User Interface Design

### 3.1 Homepage

- Brief explanation of the app's purpose
- Selection for default currency display (NZD or AUD)
- Three prominent buttons for accessing each basket type
- Summary statistics showing overall price difference between countries

### 3.2 Basket View

- Display of all products in the selected basket
- Simple toggle between Basic, Standard, and Luxury baskets
- Total basket cost in both countries with percentage difference
- Clear indicator of which country is cheaper overall for this basket

### 3.3 Category View

- Secondary navigation allowing users to filter basket items by category
- Categories: Dairy, Produce, Bakery, Meat & Seafood, Pantry, Snacks, Beverages,
  Household

### 3.4 Product Display

- Grid layout showing product comparisons side by side
- For each product:
  - Product image
  - Product name and brief description
  - NZ price (in NZD)
  - AU price (converted to NZD for easy comparison)
  - Percentage difference
  - Visual indicator showing which country has the lower price

### 3.5 UI Mockup for Product Comparison

```
+------------------+  +------------------+
|                  |  |                  |
|  [Product Image] |  |  [Product Image] |
|                  |  |                  |
+------------------+  +------------------+
| Weetbix 1.2kg    |  | Weetbix 1.2kg    |
| Breakfast cereal |  | Breakfast cereal |
|                  |  |                  |
| NZ: $7.50        |  | AU: $6.80 NZD    |
|                  |  | (10% cheaper)    |
|     [NZ FLAG]    |  |     [AU FLAG]    |
+------------------+  +------------------+
```

## 4. Technical Implementation

### 4.1 Data Collection

- One-time scraping process to collect product data from both Woolworths NZ and
  AU websites
- Manual curation to match products and assign them to appropriate baskets and
  buckets
- Static currency conversion rate to be used (implementation detail: store as
  separate configuration value that can be updated)

### 4.2 Database

- Simple database to store product information, prices, and basket assignments
- No need for user accounts or personalization features

### 4.3 Backend

- Basic API endpoints:
  - GET /baskets - List all basket types
  - GET /baskets/{type} - Get all products in a specific basket
  - GET /categories - List all product categories
  - GET /categories/{category} - Get products in a specific category
  - GET /products/{id} - Get details for a specific product

### 4.4 Frontend

- Responsive web design that works well on both desktop and mobile
- Simple, clean UI focused on easy product comparison
- No complex interactive features required

## 5. Special Cases and Edge Cases

### 5.1 Similar But Not Identical Products

For products that don't have exact matches:

- Clearly indicate differences in product descriptions
- Use the "bucket" concept to group similar items
- Example: "Free Range Eggs (dozen, large)" vs "Free Range Eggs (10 pack,
  medium)"

### 5.2 Price Ranges

- For simple comparison, we'll use a representative price from one store in each
  country
- Note in the UI that prices may vary between locations

### 5.3 Currency Conversion

- Use a static exchange rate for initial version
- Display prices in user's selected currency (NZD or AUD)
- Include last updated date for exchange rate

## 6. Future Enhancements (v2)

### 6.1 Enhanced Location Features

- Allow users to select specific store locations in each country
- Show price variations between different stores

### 6.2 Dynamic Updates

- Implement periodic scraping to keep prices current
- Add timestamps to show when prices were last updated

### 6.3 Custom Baskets

- Allow users to create and save their own custom baskets

### 6.4 Advanced Visualization

- Add charts and graphs to better illustrate price differences

## 7. Development Timeline

### 7.1 Phase 1: Data Collection and Preparation

- Develop scraping tool for Woolworths websites
- Manually match products and assign to baskets
- Create initial database structure

### 7.2 Phase 2: Core Application Development

- Implement backend API
- Develop frontend UI
- Basic testing and refinement

### 7.3 Phase 3: Finalization and Launch

- Comprehensive testing
- UI/UX polishing
- Deployment and launch

## 8. Success Metrics

- User engagement (time spent on site)
- Number of basket views
- Social media shares
- User feedback on accuracy and usefulness of comparisons
