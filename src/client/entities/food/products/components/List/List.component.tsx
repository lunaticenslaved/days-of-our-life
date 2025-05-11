import { Box, Flex, Text, List } from '#/ui-lib/components';
import { WithInputProps } from '#/ui-lib/types';
import { ReactNode, useMemo } from 'react';
import { getFoodProductKeywords, orderFoodProducts } from '../../utils';
import { FoodProduct } from '#/shared/models/food';

type ListComponentProps = WithInputProps<
  string[] | undefined,
  {
    products: FoodProduct[];
    renderActions?: (ing: FoodProduct) => ReactNode;
    onItemClick?: (ing: FoodProduct) => void;
    autoFocus?: 'search';
    maxHeight: string;
  }
>;

export function ListComponent({
  value,
  onValueUpdate,
  products,
  renderActions,
  onItemClick,
  autoFocus,
  maxHeight,
}: ListComponentProps) {
  const orderedProducts = useMemo(() => {
    return orderFoodProducts(products);
  }, [products]);

  return (
    <List value={value} onValueUpdate={onValueUpdate}>
      <Box spacing={{ px: 4, pt: 4 }}>
        <List.Search placeholder="Поиск..." autoFocus={autoFocus === 'search'} />
      </Box>
      <List.Empty>
        <Box spacing={{ px: 4 }}>Продукты не найдены</Box>
      </List.Empty>
      <List.Group>
        <Box spacing={{ px: 4, pb: 4 }} maxHeight={maxHeight} overflow="auto">
          {orderedProducts.map(product => {
            return (
              <List.Item
                key={product.id}
                value={product.id}
                keywords={getFoodProductKeywords(product)}
                onClick={() => onItemClick?.(product)}>
                <Flex gap={2} alignItems="center">
                  <Text>{product.name}</Text>
                  {!!renderActions && <Box>{renderActions?.(product)}</Box>}
                </Flex>
              </List.Item>
            );
          })}
        </Box>
      </List.Group>
    </List>
  );
}
