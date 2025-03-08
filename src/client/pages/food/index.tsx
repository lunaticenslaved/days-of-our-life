import { matchPath, Navigate, Outlet, Route, useLocation, useParams } from 'react-router';

import { createNavigationHook } from '#/client/hooks/navigation';

import ProductCreate from './products/Create';
import ProductsRoot from './products/Root';
import ProductOverview from './products/[productId]/Overview';
import ProductEdit from './products/[productId]/Edit';
import RecipesRoot from './recipes/Root';
import RecipeCreate from './recipes/Create';
import RecipeOverview from './recipes/[recipeId]/Overview';
import RecipeEdit from './recipes/[recipeId]/Edit';
import { Button } from '#/ui-lib/atoms/Button';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Selectable } from '#/ui-lib/molecules/Selectable';

type RecipeId = { recipeId: string };
type ProductId = { productId: string };

const routes = {
  root: '/food',

  // Products
  products: '/food/products',
  productCreate: '/food/products/create',
  productEdit: '/food/products/:productId/edit',
  productOverview: '/food/products/:productId',

  // Recipes
  recipes: '/food/recipes',
  recipeCreate: '/food/recipes/create',
  recipeOverview: '/food/recipes/:recipeId',
  recipeEdit: '/food/recipes/:recipeId/edit',
} as const;

export const FOOD_NAVIGATION = {
  toRoot: () => routes.root,

  // Products
  toProducts: () => routes.products,
  toProductCreate: () => routes.productCreate,
  toProductEdit: ({ productId }: ProductId) =>
    routes.productEdit.replace(':productId', productId),
  toProductOverview: ({ productId }: ProductId) =>
    routes.productOverview.replace(':productId', productId),

  // Recipes
  toRecipes: () => routes.recipes,
  toRecipeOverview: ({ recipeId }: RecipeId) =>
    routes.recipeOverview.replace(':recipeId', recipeId),
  toRecipeCreate: () => `${routes.recipeCreate}`,
  toRecipeEdit: ({ recipeId }: RecipeId) =>
    routes.recipeEdit.replace(':recipeId', recipeId),
};

export function useFoodPageParams() {
  return useParams<RecipeId & ProductId>();
}

export const useFoodNavigation = createNavigationHook(FOOD_NAVIGATION);

export default [
  <Route
    key="food"
    path={routes.root}
    element={
      <div style={{ display: 'flex' }}>
        <Navigation />
        <div style={{ flexGrow: 1, overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
    }>
    <Route index element={<Navigate to={FOOD_NAVIGATION.toProducts()} />} />
    <Route path={routes.products} element={<ProductsRoot />} />
    <Route path={routes.productCreate} element={<ProductCreate />} />
    <Route path={routes.productOverview} element={<ProductOverview />} />
    <Route path={routes.productEdit} element={<ProductEdit />} />

    <Route path={routes.recipes} element={<RecipesRoot />} />
    <Route path={routes.recipeCreate} element={<RecipeCreate />} />
    <Route path={routes.recipeOverview} element={<RecipeOverview />} />
    <Route path={routes.recipeEdit} element={<RecipeEdit />} />
  </Route>,
];

function Navigation() {
  const links = [
    {
      to: FOOD_NAVIGATION.toProducts(),
      title: 'Продукты',
    },
    {
      to: FOOD_NAVIGATION.toRecipes(),
      title: 'Рецепты',
    },
  ];

  const { pathname } = useLocation();

  const currentLink = links.find(link => matchPath(link.to, pathname));

  return (
    <Selectable value={currentLink?.to}>
      <Flex direction="column" gap={4} spacing={{ py: 0, px: 2 }}>
        {links.map(link => {
          return (
            <Selectable.Item key={link.to} value={link.to}>
              {({ isActive }) => {
                return (
                  <Button
                    component="router-link"
                    view="clear"
                    color={isActive ? 'primary' : 'secondary'}
                    to={link.to}>
                    {link.title}
                  </Button>
                );
              }}
            </Selectable.Item>
          );
        })}
      </Flex>
    </Selectable>
  );
}
