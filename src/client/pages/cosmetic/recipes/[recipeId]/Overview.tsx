import {
  CosmeticRecipeCommentCreatingAction,
  CosmeticRecipeCommentsList,
} from '#/client/entities/cosmetic/recipe-comments';
import {
  CosmeticRecipeActions,
  useGetCosmeticRecipeQuery,
} from '#/client/entities/cosmetic/recipes';
import { useCosmeticNavigation, useCosmeticPageParams } from '#/client/pages/cosmetic';
import { useListCosmeticIngredientsQuery } from '#/client/store';
import { Page } from '#/client/widgets/Page';
import { Box } from '#/ui-lib/atoms/Box';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Text } from '#/ui-lib/atoms/Text';
import { getSpacingStyles } from '#/ui-lib/utils/spacing';

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
          <Box flexGrow={1}>
            <Flex direction={'column'} gap={4}>
              <div>
                <h4>Имя</h4>
                <Text>{recipe.name}</Text>
              </div>

              <div>
                <h4>Описание</h4>
                <Text whiteSpace="break-spaces">{recipe.description || '-'}</Text>
              </div>

              <div>
                <h4>Ингредиенты</h4>
                <ul>
                  {recipe.phases.map((phase, index) => {
                    return (
                      <li key={recipeId + index}>
                        <Box spacing={{ mb: 4 }}>
                          <div>Фаза {index + 1}</div>
                          <ul>
                            {phase.ingredients.map(
                              ({ ingredientId, percent, comment }) => {
                                const ingredient = cosmeticIngredients.find(
                                  i => i.id === ingredientId,
                                );

                                return (
                                  <li
                                    key={ingredientId}
                                    style={getSpacingStyles({ mb: 1 })}>
                                    <Flex direction="column" minWidth="100%">
                                      <Flex
                                        alignItems="start"
                                        justifyContent="space-between"
                                        gap={2}
                                        flexGrow={1}>
                                        <Text>{ingredient?.name || '-'}</Text>
                                        <Text wordWrap="unset" minWidth="max-content">
                                          {percent} %
                                        </Text>
                                      </Flex>
                                      {comment && <Text variant="body-s">{comment}</Text>}
                                    </Flex>
                                  </li>
                                );
                              },
                            )}
                          </ul>
                        </Box>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Flex>
          </Box>

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
