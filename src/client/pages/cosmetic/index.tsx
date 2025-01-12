import { Navigate, Outlet, Route, useParams } from 'react-router';

import { createNavigationHook } from '#/client/hooks/navigation';

import ProductCreate from './products/Create';
import ProductsRoot from './products/Root';
import BenefitsRoot from './benefits/Root';
import ProductOverview from './products/[productId]/Overivew';
import ProductEdit from './products/[productId]/Edit';
import { Link } from 'react-router-dom';

type ProductId = { productId: string };

const routes = {
  root: '/cosmetic',

  // Products
  products: '/cosmetic/products',
  productCreate: '/cosmetic/products/create',
  productEdit: '/cosmetic/products/:productId/edit',
  productOverview: '/cosmetic/products/:productId',

  // Benefits
  benefits: '/cosmetic/benefits',
} as const;

export const COSMETIC_NAVIGATION = {
  toRoot: () => routes.root,

  // Products
  toProducts: () => routes.products,
  toProductCreate: () => routes.productCreate,
  toProductEdit: ({ productId }: ProductId) =>
    routes.productEdit.replace(':productId', productId),
  toProductOverview: ({ productId }: ProductId) =>
    routes.productOverview.replace(':productId', productId),

  // Benefits
  toBenefits: () => routes.benefits,
};

export function useCosmeticPageParams() {
  return useParams<ProductId>();
}

export const useCosmeticNavigation = createNavigationHook(COSMETIC_NAVIGATION);

export default [
  <Route
    key="cosmetic"
    path={routes.root}
    element={
      <div style={{ display: 'flex' }}>
        <aside style={{ width: '100px', display: 'flex', flexDirection: 'column' }}>
          <Link to={COSMETIC_NAVIGATION.toProducts()}>Продукты</Link>
          <Link to={COSMETIC_NAVIGATION.toBenefits()}>Бенефиты</Link>
        </aside>
        <div style={{ flexGrow: 1, overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
    }>
    <Route path={routes.products} element={<ProductsRoot />} />
    <Route path={routes.productCreate} element={<ProductCreate />} />
    <Route path={routes.productOverview} element={<ProductOverview />} />
    <Route path={routes.productEdit} element={<ProductEdit />} />

    {/* Benefits */}
    <Route path={routes.benefits} element={<BenefitsRoot />} />

    <Route index element={<Navigate to={COSMETIC_NAVIGATION.toProducts()} />} />
  </Route>,
];
