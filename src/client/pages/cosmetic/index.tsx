import { Navigate, Outlet, Route, useParams } from 'react-router';

import { createNavigationHook } from '#/client/hooks/navigation';

import RecipesRoot from './recipes/Root';
import RecipeCreate from './recipes/Create';
import ProductCreate from './products/Create';
import IngredientsRoot from './ingredients/Root';
import ProductsRoot from './products/Root';
import BenefitsRoot from './benefits/Root';
import RecipeOverview from './recipes/[recipeId]/Overview';
import RecipeEdit from './recipes/[recipeId]/Edit';
import ProductOverview from './products/[productId]/Overview';
import ProductEdit from './products/[productId]/Edit';
import INCIIngredientsRoot from './inci-ingredients/Root';
import { Link } from 'react-router-dom';

type ProductId = { productId: string };
type RecipeId = { recipeId: string };

const routes = {
  root: '/cosmetic',

  // Products
  products: '/cosmetic/products',
  productCreate: '/cosmetic/products/create',
  productEdit: '/cosmetic/products/:productId/edit',
  productOverview: '/cosmetic/products/:productId',

  // Benefits
  benefits: '/cosmetic/benefits',

  // Ingredients
  ingredients: '/cosmetic/ingredients',

  // Recipes
  recipes: '/cosmetic/recipes',
  recipeCreate: '/cosmetic/recipes/create',
  recipeOverview: '/cosmetic/recipes/:recipeId',
  recipeEdit: '/cosmetic/recipes/:recipeId/edit',

  // INCI Ingredients
  INCIIngredients: '/cosmetic/inci-ingredients',
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

  // Ingredients
  toIngredients: () => routes.ingredients,

  // Recipes
  toRecipes: () => routes.recipes,
  toRecipeCreate: () => routes.recipeCreate,
  toRecipeOverview: ({ recipeId }: RecipeId) =>
    routes.recipeOverview.replace(':recipeId', recipeId),
  toRecipeEdit: ({ recipeId }: RecipeId) =>
    routes.recipeEdit.replace(':recipeId', recipeId),

  // INCI Ingredients
  toINCIIngredients: () => routes.INCIIngredients,
};

export function useCosmeticPageParams() {
  return useParams<ProductId & RecipeId>();
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
          <Link to={COSMETIC_NAVIGATION.toIngredients()}>Ингредиенты</Link>
          <Link to={COSMETIC_NAVIGATION.toINCIIngredients()}>INCI Ингредиенты</Link>
          <Link to={COSMETIC_NAVIGATION.toRecipes()}>Рецепты</Link>
        </aside>
        <div style={{ flexGrow: 1, overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
    }>
    {/* Products */}
    <Route path={routes.products} element={<ProductsRoot />} />
    <Route path={routes.productCreate} element={<ProductCreate />} />
    <Route path={routes.productOverview} element={<ProductOverview />} />
    <Route path={routes.productEdit} element={<ProductEdit />} />

    {/* Benefits */}
    <Route path={routes.benefits} element={<BenefitsRoot />} />

    {/* Ingredients */}
    <Route path={routes.ingredients} element={<IngredientsRoot />} />

    {/* Recipes */}
    <Route path={routes.recipes} element={<RecipesRoot />} />
    <Route path={routes.recipeCreate} element={<RecipeCreate />} />
    <Route path={routes.recipeOverview} element={<RecipeOverview />} />
    <Route path={routes.recipeEdit} element={<RecipeEdit />} />

    {/* INCI Ingredients */}
    <Route path={routes.INCIIngredients} element={<INCIIngredientsRoot />} />

    {/* Others */}
    <Route
      path={routes.root}
      element={<Navigate to={COSMETIC_NAVIGATION.toProducts()} />}
    />
  </Route>,
];
