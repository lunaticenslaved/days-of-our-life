import {
  FoodRecipeSelect,
  FoodRecipeSelectProps,
} from '#/client/entities/food/components/RecipeSelect';
import { useListFoodRecipesQuery } from '#/client/store';

interface FoodRecipeSearchProps extends Omit<FoodRecipeSelectProps, 'recipes'> {}

export function FoodRecipeSearch(props: FoodRecipeSearchProps) {
  const recipesQuery = useListFoodRecipesQuery();

  return <FoodRecipeSelect {...props} recipes={recipesQuery.data || []} />;
}
