import { FoodRecipe } from '#shared/models/food';

interface FoodRecipeOutputProps {
  output: FoodRecipe['output'];
}

export function FoodRecipeOutput({ output }: FoodRecipeOutputProps) {
  return (
    <ul>
      <li>{output.grams} г</li>
      <li>{output.servings} порций</li>
    </ul>
  );
}
