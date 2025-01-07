import { FoodRecipeForm } from '#/client/entities/food';
import { useFoodNavigation } from '#/client/pages/food';
import { useCreateFoodRecipeMutation } from '#/client/store';

export default function Page() {
  const navigation = useFoodNavigation();

  const creating = useCreateFoodRecipeMutation({
    onSuccess: recipe => navigation.toRecipeOverview({ recipeId: recipe.id }),
  });

  return <FoodRecipeForm onSubmit={creating.mutate} />;
}
