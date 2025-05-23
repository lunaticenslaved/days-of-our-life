import { FOOD_NAVIGATION } from '#/client/pages/food';
import { Button } from '#/ui-lib/components/atoms/Button/Button';
import { Page } from '#/client/widgets/Page';
import {
  FoodRecipeFilters,
  FoodRecipesTable,
  useFoodRecipeFilters,
  useListFoodRecipesQuery,
} from '#/client/entities/food/recipes';

export default function FoodRecipesRootPage() {
  const { data: recipes = [] } = useListFoodRecipesQuery();

  const filters = useFoodRecipeFilters();

  return (
    <Page>
      <Page.Header>
        <Page.Title>Рецепты</Page.Title>
        <Page.Actions>
          <Button
            view="outlined"
            component="router-link"
            to={FOOD_NAVIGATION.toRecipeCreate()}>
            Создать рецепт
          </Button>
        </Page.Actions>
      </Page.Header>

      <Page.Header>
        <FoodRecipeFilters value={filters.value} onValueUpdate={filters.onValueUpdate} />
      </Page.Header>

      <Page.Content>
        <FoodRecipesTable
          recipes={filters.filter(recipes)}
          to={recipe => FOOD_NAVIGATION.toRecipeOverview({ recipeId: recipe.id })}
        />
      </Page.Content>
    </Page>
  );
}
