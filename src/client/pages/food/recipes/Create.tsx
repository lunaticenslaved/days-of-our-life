import { FoodRecipeForm, useCreateFoodRecipeMutation } from '#/client/entities/food';
import { useFoodNavigation, useFoodPageParams } from '#/client/pages/food';

export default function Page() {
  const { recipeId = '' } = useFoodPageParams();
  const navigation = useFoodNavigation();

  const editing = useCreateFoodRecipeMutation({
    onSuccess: () => navigation.toRecipeOverview({ recipeId }),
  });

  return <FoodRecipeForm onSubmit={editing.mutate} />;
}
