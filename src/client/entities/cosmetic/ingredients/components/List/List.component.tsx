import { CosmeticIngredient } from '#/shared/models/cosmetic';
import { Box, Flex, Text, List } from '#/ui-lib/components';
import { WithInputProps } from '#/ui-lib/types';
import { ReactNode } from 'react';
import { getCosmeticIngredientKeywords } from '../../utils';

type ListComponentProps = WithInputProps<
  string[] | undefined,
  {
    ingredients: CosmeticIngredient[];
    renderActions?: (ing: CosmeticIngredient) => ReactNode;
    onItemClick?: (ing: CosmeticIngredient) => void;
  }
>;

export function ListComponent({
  value,
  onValueUpdate,
  ingredients,
  renderActions,
  onItemClick,
}: ListComponentProps) {
  return (
    <List value={value} onValueUpdate={onValueUpdate}>
      <Box spacing={{ px: 4, pt: 4 }}>
        <List.Search placeholder="Поиск..." />
      </Box>
      <List.Empty>
        <Box spacing={{ px: 4 }}>Ингредиенты не найдены</Box>
      </List.Empty>
      <List.Group>
        <Box spacing={{ px: 4, pb: 4 }} overflow="auto">
          {ingredients.map(ingredient => {
            return (
              <List.Item
                key={ingredient.id}
                value={ingredient.id}
                keywords={getCosmeticIngredientKeywords(ingredient)}
                onClick={() => onItemClick?.(ingredient)}>
                <Flex gap={2} alignItems="center">
                  <Box flexGrow={1}>
                    <Text>{ingredient.name}</Text>
                  </Box>
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
