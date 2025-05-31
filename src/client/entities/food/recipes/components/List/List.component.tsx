import { FoodRecipe } from '#/shared/models/food';
import { Box } from '#/ui-lib/components/atoms/Box';
import { Flex } from '#/ui-lib/components/atoms/Flex';
import { Text } from '#/ui-lib/components/atoms/Text';
import { List } from '#/ui-lib/components/molecules/List';
import { WithInputProps } from '#/ui-lib/types';
import { ReactNode, useMemo } from 'react';
import _ from 'lodash';
import { getFoodRecipeKeywords } from '#/client/entities/food/recipes/utils';

type LocalFoodRecipe = Pick<FoodRecipe, 'id' | 'name'>;

type ListComponentProps = WithInputProps<
  string[] | undefined,
  {
    isFetching: boolean;
    recipes: LocalFoodRecipe[];
    renderActions?: (ing: LocalFoodRecipe) => ReactNode;
    autoFocus?: 'search';
  }
>;

export function ListComponent({
  value,
  onValueUpdate,
  recipes,
  renderActions,
  autoFocus,
  isFetching,
}: ListComponentProps) {
  const orderedBenefits = useMemo(() => {
    return _.orderBy(recipes, item => item.name, 'asc');
  }, [recipes]);

  return (
    <List value={value} onValueUpdate={onValueUpdate}>
      <Box spacing={{ px: 4, pt: 4 }}>
        <List.Search placeholder="Поиск..." autoFocus={autoFocus === 'search'} />
      </Box>
      <List.Empty>Рецепты не найдены</List.Empty>
      <List.Group>
        {isFetching ? (
          <div>Loading...</div>
        ) : (
          <Box spacing={{ px: 4, pb: 4 }} overflow="auto">
            {orderedBenefits.map(recipe => {
              return (
                <List.Item
                  key={recipe.id}
                  value={recipe.id}
                  keywords={getFoodRecipeKeywords(recipe)}>
                  <Flex gap={2}>
                    <Text>{recipe.name}</Text>
                    {!!renderActions && <Box>{renderActions?.(recipe)}</Box>}
                  </Flex>
                </List.Item>
              );
            })}
          </Box>
        )}
      </List.Group>
    </List>
  );
}
