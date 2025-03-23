import {
  CosmeticRecipeCommentCreatingAction,
  CosmeticRecipeCommentsList,
} from '#/client/entities/cosmetic/recipe-comments';
import { CosmeticRecipeActions } from '#/client/entities/cosmetic/recipes';
import { useCosmeticNavigation, useCosmeticPageParams } from '#/client/pages/cosmetic';
import {
  useGetCosmeticRecipeQuery,
  useListCosmeticIngredientsQuery,
} from '#/client/store';
import { Page } from '#/client/widgets/Page';

export default function CosmeticRecipeOverviewPage() {
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
    <Page>
      <Page.Header>
        <Page.Title>{recipe.name}</Page.Title>
        <Page.Actions>
          <CosmeticRecipeActions
            recipe={recipe}
            onDeleted={cosmeticNavigation.toRecipes}
          />
        </Page.Actions>
      </Page.Header>

      <Page.Content>
        <div style={{ display: 'flex' }}>
          <div style={{ flexGrow: 1 }}>
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

          <div>
            <h3>Комментарии</h3>
            <CosmeticRecipeCommentCreatingAction recipeId={recipeId} />
            <CosmeticRecipeCommentsList recipeId={recipeId} />
          </div>
        </div>
      </Page.Content>
    </Page>
  );
}
