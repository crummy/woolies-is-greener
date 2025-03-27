# NZ vs AU Woolworths Price Comparison App: Development TODO List

## Phase 1: Project Setup & Infrastructure

- [x] Initialize Remix project with TypeScript configuration
- [x] Set up Cloudflare Pages project with KV store
- [x] Configure GitHub repository with CI/CD pipeline for Cloudflare deployment
- [x] Set up development environment with necessary tooling
- [x] Configure Tailwind CSS for styling
- [x] Set up project structure and basic routing using Remix conventions

## Phase 2: Data Collection & Storage

- [ ] Research Woolworths NZ and AU websites to understand their structure
- [ ] Create scraping scripts to extract product data
  - [ ] Script for AU Woolworths site
  - [ ] Script for NZ Woolworths site
- [ ] Design data structure for Cloudflare KV store
  - [ ] Products collection
  - [ ] Categories collection
  - [ ] Baskets collection
  - [ ] Product-Basket relationships
- [ ] Create data processing scripts to:
  - [ ] Clean and normalize scraped data
  - [ ] Match products between countries
  - [ ] Assign products to baskets and categories
  - [ ] Calculate price differences and percentages
- [ ] Populate KV store with processed data
- [ ] Create configuration for static currency conversion rate

## Phase 3: Backend API Development with Remix

- [ ] Set up Remix loaders and actions for data fetching
- [ ] Design and implement data access functions:
  - [ ] getBaskets() - List all basket types
  - [ ] getBasketProducts(type) - Get all products in a specific basket
  - [ ] getCategories() - List all product categories
  - [ ] getCategoryProducts(category) - Get products in a specific category
  - [ ] getProduct(id) - Get details for a specific product
- [ ] Implement currency conversion functionality
- [ ] Set up error handling and data response formatting
- [ ] Create TypeScript interfaces for all data models
- [ ] Write unit tests for data access functions
- [ ] Document backend functionality

## Phase 4: Frontend Development with Remix and React

- [ ] Create TypeScript interfaces for all data models
- [ ] Design and implement common UI components:
  - [ ] Navigation bar
  - [ ] Footer
  - [ ] Currency selector
  - [ ] Basket type selector
  - [ ] Category filter
  - [ ] Product comparison card
- [ ] Implement main application pages/routes:
  - [ ] Homepage with app explanation and basket selection
  - [ ] Basket view page
  - [ ] Category view page
- [ ] Set up client-side data fetching using Remix useLoaderData
- [ ] Implement client-side state management
- [ ] Style all components with Tailwind CSS
- [ ] Create responsive layouts for mobile and desktop
- [ ] Implement loading states and error handling

## Phase 5: Data Visualization & UI Refinement

- [ ] Create comparison indicators for product prices
- [ ] Implement basket totals calculation
- [ ] Add visual indicators for price differences (e.g., country flags)
- [ ] Refine responsive design for all screen sizes
- [ ] Optimize image loading and display
- [ ] Implement currency toggle functionality
- [ ] Add loading state animations
- [ ] Implement UI for displaying similar but not identical products
- [ ] Polish UI/UX details (hover states, transitions, etc.)

## Phase 6: Testing & Optimization

- [ ] Write unit tests for frontend components
- [ ] Perform end-to-end testing
- [ ] Optimize performance:
  - [ ] Image optimization
  - [ ] Code splitting (using Remix's built-in capabilities)
  - [ ] Bundle size optimization
- [ ] Implement browser caching strategies
- [ ] Test across different browsers and devices
- [ ] Perform accessibility testing (WCAG compliance)
- [ ] Optimize SEO (using Remix's meta functions)

## Phase 7: Deployment & Launch

- [ ] Set up production environment on Cloudflare Pages
- [ ] Configure custom domain (if applicable)
- [ ] Set up analytics tracking
- [ ] Create deployment pipeline for CI/CD
- [ ] Perform final QA testing
- [ ] Deploy application to production
- [ ] Monitor application performance and errors
- [ ] Document deployment and maintenance procedures

## Phase 8: Documentation & Handoff

- [ ] Create user documentation
- [ ] Write technical documentation:
  - [ ] System architecture
  - [ ] Data structure
  - [ ] KV store organization
  - [ ] Deployment process
- [ ] Document data update process
- [ ] Create maintenance guide

## Additional Considerations

- [ ] Implement data versioning for price updates
- [ ] Add last updated timestamps for price data
- [ ] Create admin interface for manual data updates (potentially a separate
      Remix route)
- [ ] Consider implementing basic analytics to track most viewed comparisons
- [ ] Plan for periodic data refreshes
- [ ] Implement caching strategies for KV store data to minimize read operations
