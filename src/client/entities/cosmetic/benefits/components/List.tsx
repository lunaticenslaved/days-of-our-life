import { CosmeticBenefit } from '#/shared/models/cosmetic';
import { Box } from '#/ui-lib/components/atoms/Box';
import { Flex } from '#/ui-lib/components/atoms/Flex';
import { Text } from '#/ui-lib/components/atoms/Text';
import { List } from '#/ui-lib/components/molecules/List';
import { WithInputProps } from '#/ui-lib/types';
import { ReactNode } from 'react';
import { getCosmeticBenefitKeywords } from '../utils';

type ListComponentProps = WithInputProps<
  string[] | undefined,
  {
    benefits: CosmeticBenefit[];
    renderActions?: (ing: CosmeticBenefit) => ReactNode;
  }
>;

export function ListComponent({
  value,
  onValueUpdate,
  benefits,
  renderActions,
}: ListComponentProps) {
  return (
    <List value={value} onValueUpdate={onValueUpdate}>
      <Box spacing={{ px: 4, pt: 4 }}>
        <List.Search placeholder="Поиск..." />
      </Box>
      <List.Empty>Преимущества не найдены</List.Empty>
      <List.Group>
        <Box spacing={{ px: 4, pb: 4 }} overflow="auto">
          {benefits.map(benefit => {
            return (
              <List.Item
                key={benefit.id}
                value={benefit.id}
                keywords={getCosmeticBenefitKeywords(benefit)}>
                <Flex gap={2}>
                  <Text>{benefit.name}</Text>
                  {!!renderActions && <Box>{renderActions?.(benefit)}</Box>}
                </Flex>
              </List.Item>
            );
          })}
        </Box>
      </List.Group>
    </List>
  );
}
