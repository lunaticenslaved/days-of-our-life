import { Navigate, Outlet, Route, useParams } from 'react-router';

import { createNavigationHook } from '#/client/hooks/navigation';

import RecipesRoot from './recipes/Root';
import RecipeCreate from './recipes/Create';
import ProductCreate from './products/Create';
import IngredientsRoot from './ingredients/Root';
import IngredientCreate from './ingredients/Create';
import IngredientEdit from './ingredients/[ingredientId]/Edit';
import IngredientOverview from './ingredients/[ingredientId]/Overview';
import ProductsRoot from './products/Root';
import ApplicationsRoot from './applications/Root';
import BenefitsRoot from './benefits/Root';
import RecipeOverview from './recipes/[recipeId]/Overview';
import RecipeEdit from './recipes/[recipeId]/Edit';
import ProductOverview from './products/[productId]/Overview';
import ProductEdit from './products/[productId]/Edit';
import INCIIngredientsRoot from './inci-ingredients/Root';
import { SubNavigation, SubNavigationItem } from '#/client/widgets/navigation';

type ProductId = { productId: string };
type RecipeId = { recipeId: string };
type IngredientId = { ingredientId: string };

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
  ingredientCreate: '/cosmetic/ingredients/create',
  ingredientEdit: '/cosmetic/ingredients/:ingredientId/edit',
  ingredientOverview: '/cosmetic/ingredients/:ingredientId',

  // Recipes
  recipes: '/cosmetic/recipes',
  recipeCreate: '/cosmetic/recipes/create',
  recipeOverview: '/cosmetic/recipes/:recipeId',
  recipeEdit: '/cosmetic/recipes/:recipeId/edit',

  // INCI Ingredients
  INCIIngredients: '/cosmetic/inci-ingredients',

  // Applications
  applications: '/cosmetic/applications',
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
  toIngredientCreate: () => routes.ingredientCreate,
  toIngredientEdit: ({ ingredientId }: IngredientId) =>
    routes.ingredientEdit.replace(':ingredientId', ingredientId),
  toIngredientOverview: ({ ingredientId }: IngredientId) =>
    routes.ingredientOverview.replace(':ingredientId', ingredientId),

  // Recipes
  toRecipes: () => routes.recipes,
  toRecipeCreate: () => routes.recipeCreate,
  toRecipeOverview: ({ recipeId }: RecipeId) =>
    routes.recipeOverview.replace(':recipeId', recipeId),
  toRecipeEdit: ({ recipeId }: RecipeId) =>
    routes.recipeEdit.replace(':recipeId', recipeId),

  // INCI Ingredients
  toINCIIngredients: () => routes.INCIIngredients,

  // Applications
  toApplications: () => routes.applications,
};

export function useCosmeticPageParams() {
  return useParams<ProductId & RecipeId & IngredientId>();
}

export const useCosmeticNavigation = createNavigationHook(COSMETIC_NAVIGATION);

const SUBNAVIGATION_ITEMS: SubNavigationItem[] = [
  {
    to: COSMETIC_NAVIGATION.toApplications(),
    title: 'Применение',
  },
  {
    to: COSMETIC_NAVIGATION.toProducts(),
    title: 'Продукты',
  },
  {
    to: COSMETIC_NAVIGATION.toRecipes(),
    title: 'Рецепты',
  },
  {
    to: COSMETIC_NAVIGATION.toIngredients(),
    title: 'Ингредиенты',
  },
  {
    to: COSMETIC_NAVIGATION.toINCIIngredients(),
    title: 'INCI Ингредиенты',
  },
  {
    to: COSMETIC_NAVIGATION.toBenefits(),
    title: 'Бенефиты',
  },
];

export default [
  <Route
    key="cosmetic"
    path={routes.root}
    element={
      <>
        <SubNavigation items={SUBNAVIGATION_ITEMS} />
        <Outlet />
      </>
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
    <Route path={routes.ingredientCreate} element={<IngredientCreate />} />
    <Route path={routes.ingredientEdit} element={<IngredientEdit />} />
    <Route path={routes.ingredientOverview} element={<IngredientOverview />} />

    {/* Recipes */}
    <Route path={routes.recipes} element={<RecipesRoot />} />
    <Route path={routes.recipeCreate} element={<RecipeCreate />} />
    <Route path={routes.recipeOverview} element={<RecipeOverview />} />
    <Route path={routes.recipeEdit} element={<RecipeEdit />} />

    {/* INCI Ingredients */}
    <Route path={routes.INCIIngredients} element={<INCIIngredientsRoot />} />

    {/* Applications */}
    <Route path={routes.applications} element={<ApplicationsRoot />} />

    {/* Others */}
    <Route
      path={routes.root}
      element={<Navigate to={COSMETIC_NAVIGATION.toProducts()} />}
    />
  </Route>,
];
