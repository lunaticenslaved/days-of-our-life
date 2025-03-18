import { FOOD_NAVIGATION } from '#/client/pages/food';
import { useListFoodRecipesQuery } from '#/client/store';
import { Button } from '#/ui-lib/atoms/Button';
import { Page } from '#/client/widgets/Page';
import {
  FoodRecipeFilters,
  FoodRecipesTable,
  useFoodRecipeFilters,
} from '#/client/entities/food/recipes';

export default function FoodRecipesPage() {
  const { data: recipes = [] } = useListFoodRecipesQuery();

  const filters = useFoodRecipeFilters();

  return (
    <Page
      title="Рецепты"
      actions={
        <Button
          view="outlined"
          component="router-link"
          to={FOOD_NAVIGATION.toRecipeCreate()}>
          Создать рецепт
        </Button>
      }
      filters={
        <FoodRecipeFilters value={filters.value} onValueUpdate={filters.onValueUpdate} />
      }>
      <FoodRecipesTable
        recipes={filters.filter(recipes)}
        to={recipe => FOOD_NAVIGATION.toRecipeOverview({ recipeId: recipe.id })}
      />
    </Page>
  );
}
