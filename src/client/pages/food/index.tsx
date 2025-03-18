import { Navigate, Outlet, Route, useParams } from 'react-router';

import { createNavigationHook } from '#/client/hooks/navigation';

import ProductCreate from './products/Create';
import ProductsRoot from './products/Root';
import ProductOverview from './products/[productId]/Overview';
import ProductEdit from './products/[productId]/Edit';
import RecipesRoot from './recipes/Root';
import RecipeCreate from './recipes/Create';
import RecipeOverview from './recipes/[recipeId]/Overview';
import RecipeEdit from './recipes/[recipeId]/Edit';
import { SubNavigation, SubNavigationItem } from '#/client/widgets/navigation';

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

const SUBNAVIGATION_ITEMS: SubNavigationItem[] = [
  {
    to: FOOD_NAVIGATION.toProducts(),
    title: 'Продукты',
  },
  {
    to: FOOD_NAVIGATION.toRecipes(),
    title: 'Рецепты',
  },
];

export default [
  <Route
    key="food"
    path={routes.root}
    element={
      <>
        <SubNavigation items={SUBNAVIGATION_ITEMS} />
        <Outlet />
      </>
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
