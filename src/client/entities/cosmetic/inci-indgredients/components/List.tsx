import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';
import { Box } from '#/ui-lib/atoms/Box';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Text } from '#/ui-lib/atoms/Text';
import { List } from '#/ui-lib/molecules/List';
import { WithInputProps } from '#/ui-lib/types';
import { ReactNode } from 'react';
import { getCosmeticINCIIngredientKeywords } from '../utils';

type ListComponentProps = WithInputProps<
  string[] | undefined,
  {
    ingredients: CosmeticINCIIngredient[];
    renderActions?: (ing: CosmeticINCIIngredient) => ReactNode;
  }
>;

export function ListComponent({
  value,
  onValueUpdate,
  ingredients,
  renderActions,
}: ListComponentProps) {
  return (
    <List value={value} onValueUpdate={onValueUpdate}>
      <Box spacing={{ px: 4, pt: 4 }}>
        <List.Search placeholder="Поиск..." />
      </Box>
      <List.Empty>Ингредиенты не найдены</List.Empty>
      <List.Group>
        <Box spacing={{ px: 4, pb: 4 }} overflow="auto">
          {ingredients.map(ingredient => {
            return (
              <List.Item
                key={ingredient.id}
                value={ingredient.id}
                keywords={getCosmeticINCIIngredientKeywords(ingredient)}>
                <Flex gap={2}>
                  <Text>{ingredient.name}</Text>
                  {!!renderActions && <Box>{renderActions?.(ingredient)}</Box>}
                </Flex>
              </List.Item>
            );
          })}
        </Box>
      </List.Group>
    </List>
  );
}
