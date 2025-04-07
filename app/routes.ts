import { route, type RouteConfig } from '@react-router/dev/routes';

export default [
  route('/', 'routes/_index.tsx'),
  route('/admin/baskets', 'routes/admin.baskets.tsx'),
  route('/admin/products', 'routes/admin.products.tsx'),
  route('/admin/products/new', 'routes/admin.products_.new.tsx'),
  route('/admin/products/:id', 'routes/admin.products_.$id.tsx'),
] satisfies RouteConfig;
