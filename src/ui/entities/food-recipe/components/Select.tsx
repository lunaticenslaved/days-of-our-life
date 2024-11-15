import { FoodRecipe } from '#shared/models/food';
import { Select, SelectProps } from '#ui/components/Select';

interface FoodRecipeSelectProps extends SelectProps {
  recipes: FoodRecipe[];
}

export function FoodRecipeSelect({ recipes, ...props }: FoodRecipeSelectProps) {
  return (
    <Select {...props}>
      {recipes.map(recipe => {
        return (
          <Select.Option key={recipe.id} value={recipe.id}>
            {recipe.name}
          </Select.Option>
        );
      })}
    </Select>
  );
}
