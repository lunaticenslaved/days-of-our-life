import { Route } from 'react-router';

import { createNavigationHook } from '#ui/hooks/navigation';

import Root from './Root';
import Create from './Create';

const routes = {
  root: '/products',
  create: '/products/create',
} as const;

export const PRODUCTS_NAVIGATION = {
  toProducts: () => `${routes.root}`,
  toCreateProduct: () => `${routes.create}`,
};

export const useProductsNavigation = createNavigationHook(PRODUCTS_NAVIGATION);

export default [
  <Route key={routes.root} path={routes.root} element={<Root />} />,
  <Route key={routes.create} path={routes.create} element={<Create />} />,
];
