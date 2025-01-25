import { Route, useParams } from 'react-router';

import { createNavigationHook } from '#/client/hooks/navigation';

import ProductCreate from './Create';
import ProductsRoot from './Root';
import ProductOverview from './[medicamentId]/Overview';
import ProductEdit from './[medicamentId]/Edit';

type MedicamentId = { medicamentId: string };

const routes = {
  root: '/medicaments',

  // Products
  productCreate: '/medicaments/create',
  productEdit: '/medicaments/:medicamentId/edit',
  productOverview: '/medicaments/:medicamentId',
} as const;

export const MEDICAMENTS_NAVIGATION = {
  toRoot: () => routes.root,

  // Products
  toProductCreate: () => routes.productCreate,
  toProductEdit: ({ medicamentId }: MedicamentId) =>
    routes.productEdit.replace(':medicamentId', medicamentId),
  toProductOverview: ({ medicamentId }: MedicamentId) =>
    routes.productOverview.replace(':medicamentId', medicamentId),
};

export function useMedicamentsPageParams() {
  return useParams<MedicamentId>();
}

export const useMedicamentsNavigation = createNavigationHook(MEDICAMENTS_NAVIGATION);

export default [
  <Route key="food" path={routes.root}>
    <Route index element={<ProductsRoot />} />
    <Route path={routes.productCreate} element={<ProductCreate />} />
    <Route path={routes.productOverview} element={<ProductOverview />} />
    <Route path={routes.productEdit} element={<ProductEdit />} />
  </Route>,
];
