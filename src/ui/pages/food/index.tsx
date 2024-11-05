import { Navigate, Route, useParams } from 'react-router';

import { createNavigationHook } from '#ui/hooks/navigation';

import ProductCreate from './products/Create';
import ProductsRoot from './products/Root';
import ProductOverview from './products/[productId]/Overview';
import ProductEdit from './products/[productId]/Edit';
import RecipesRoot from './recipes/Root';
import RecipeCreate from './recipes/Create';
import RecipeOverview from './recipes/[recipeId]/Overview';
import RecipeEdit from './recipes/[recipeId]/Edit';

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
    key={routes.root}
    path={routes.root}
    element={<Navigate to={FOOD_NAVIGATION.toProducts()} />}
  />,

  // Products
  <Route key={routes.products} path={routes.products} element={<ProductsRoot />} />,
  <Route
    key={routes.productCreate}
    path={routes.productCreate}
    element={<ProductCreate />}
  />,
  <Route
    key={routes.productOverview}
    path={routes.productOverview}
    element={<ProductOverview />}
  />,
  <Route key={routes.productEdit} path={routes.productEdit} element={<ProductEdit />} />,

  // Recipes
  <Route key={routes.recipes} path={routes.recipes} element={<RecipesRoot />} />,
  <Route
    key={routes.recipeCreate}
    path={routes.recipeCreate}
    element={<RecipeCreate />}
  />,
  <Route
    key={routes.recipeOverview}
    path={routes.recipeOverview}
    element={<RecipeOverview />}
  />,
  <Route key={routes.recipeEdit} path={routes.recipeEdit} element={<RecipeEdit />} />,
];
