import { CosmeticRecipeActions } from '#/client/entities/cosmetic';
import { useCosmeticNavigation, useCosmeticPageParams } from '#/client/pages/cosmetic';
import {
  useGetCosmeticRecipeQuery,
  useListCosmeticIngredientsQuery,
} from '#/client/store';

export default function Overview() {
  const { recipeId = '' } = useCosmeticPageParams();

  const cosmeticNavigation = useCosmeticNavigation();

  const getCosmeticRecipeQuery = useGetCosmeticRecipeQuery(recipeId);
  const listCosmeticIngredientsQuery = useListCosmeticIngredientsQuery();

  const recipe = getCosmeticRecipeQuery.data;
  const cosmeticIngredients = listCosmeticIngredientsQuery.data;

  if (!recipe || !cosmeticIngredients) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CosmeticRecipeActions recipe={recipe} onDeleted={cosmeticNavigation.toRecipes} />

      <div>
        <h4>Имя</h4>
        <div>{recipe.name}</div>
      </div>

      <div>
        <h4>Описание</h4>
        <div>{recipe.description || '-'}</div>
      </div>

      <div>
        <h4>Ингредиенты</h4>
        <ul>
          {recipe.phases.map(phase => {
            return (
              <li key={phase.name}>
                <div>{phase.name}</div>
                <ul>
                  {phase.ingredients.map(({ ingredientId, percent, comment }) => {
                    const ingredient = cosmeticIngredients.find(
                      i => i.id === ingredientId,
                    );

                    return (
                      <li key={ingredientId}>
                        <div>
                          {ingredient?.name || '-'} - {percent} %
                        </div>
                        {comment && <div>{comment}</div>}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
