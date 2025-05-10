import { CosmeticBenefit } from '#/shared/models/cosmetic';
import { Box } from '#/ui-lib/components/atoms/Box';
import { Flex } from '#/ui-lib/components/atoms/Flex';
import { Text } from '#/ui-lib/components/atoms/Text';
import { List } from '#/ui-lib/components/molecules/List';
import { WithInputProps } from '#/ui-lib/types';
import { ReactNode, useMemo } from 'react';
import { getCosmeticBenefitKeywords } from '../../utils';
import _ from 'lodash';

type ListComponentProps = WithInputProps<
  string[] | undefined,
  {
    isFetchingBenefits: boolean;
    benefits: CosmeticBenefit[];
    renderActions?: (ing: CosmeticBenefit) => ReactNode;
    autoFocus?: 'search';
  }
>;

export function ListComponent({
  value,
  onValueUpdate,
  benefits,
  renderActions,
  autoFocus,
  isFetchingBenefits,
}: ListComponentProps) {
  const orderedBenefits = useMemo(() => {
    return _.orderBy(benefits, item => item.name, 'asc');
  }, [benefits]);

  return (
    <List value={value} onValueUpdate={onValueUpdate}>
      <Box spacing={{ px: 4, pt: 4 }}>
        <List.Search placeholder="Поиск..." autoFocus={autoFocus === 'search'} />
      </Box>
      <List.Empty>Преимущества не найдены</List.Empty>
      <List.Group>
        {isFetchingBenefits ? (
          <div>Loading...</div>
        ) : (
          <Box spacing={{ px: 4, pb: 4 }} overflow="auto">
            {orderedBenefits.map(benefit => {
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
        )}
      </List.Group>
    </List>
  );
}
