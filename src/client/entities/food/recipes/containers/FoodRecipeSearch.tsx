import {
  FoodRecipeSingleSelect,
  FoodRecipeSingleSelectProps,
} from '#/client/entities/food/recipes/components/RecipeSelect';
import { useListFoodRecipesQuery } from '../store';

interface FoodRecipeSearchProps extends Omit<FoodRecipeSingleSelectProps, 'entities'> {}

export function FoodRecipeSearch(props: FoodRecipeSearchProps) {
  const recipesQuery = useListFoodRecipesQuery();

  return <FoodRecipeSingleSelect {...props} entities={recipesQuery.data || []} />;
}
