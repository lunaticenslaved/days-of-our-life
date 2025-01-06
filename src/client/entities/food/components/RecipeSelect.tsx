import { FoodRecipe } from '#/shared/models/food';
import { Select, SelectProps } from '#/client/components/Select';

export interface FoodRecipeSelectProps extends SelectProps {
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
