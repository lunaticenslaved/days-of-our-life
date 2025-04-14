import { CosmeticBenefit } from '#/shared/models/cosmetic';
import { Box } from '#/ui-lib/atoms/Box';
import { Button } from '#/ui-lib/atoms/Button';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Text } from '#/ui-lib/atoms/Text';
import { WithInputProps } from '#/ui-lib/types';
import _ from 'lodash';
import { ReactNode, useMemo } from 'react';
import { CompoboxComponent } from './Combobox';
import {
  SortableCloud,
  SortableCloudElementRenderArg,
} from '#/ui-lib/molecules/SortableCloud';

type INCIIngredientTagSelectProps = WithInputProps<
  string[] | undefined,
  {
    benefits: CosmeticBenefit[];
  }
>;

export function BenefitTagSelect({
  value = [],
  onValueUpdate,
  benefits,
}: INCIIngredientTagSelectProps) {
  const benefitsMap = useMemo(() => {
    return _.fromPairs(
      benefits.map(benefit => {
        return [benefit.id, benefit];
      }),
    );
  }, [benefits]);

  return (
    <SortableCloud
      value={value}
      onValueUpdate={onValueUpdate}
      renderElement={({ id }) => {
        const benefit = benefitsMap[id];

        return (
          <Label
            // sortable={arg}
            onRemove={() => {
              onValueUpdate?.(value.filter(id => id !== benefit.id));
            }}>
            {benefit.name}
          </Label>
        );
      }}
      renderDraggedElement={({ id }) => {
        return <Label onRemove={() => null}>{benefitsMap[id].name}</Label>;
      }}
      append={
        <CompoboxComponent
          trigger={<Button size="s">Добавить +</Button>}
          benefits={benefits}
          value={value}
          onValueUpdate={arg => {
            onValueUpdate?.(arg);
          }}
        />
      }
    />
  );
}

// FIXME move to ui-lib
function Label({
  sortable,
  children,
  onRemove,
}: {
  sortable?: Pick<SortableCloudElementRenderArg, 'attributes' | 'listeners'>;
  children: ReactNode;
  onRemove?: () => void;
}) {
  return (
    <Box color="background">
      <Flex gap={2} alignItems="center">
        {!!sortable && (
          <div
            style={{ cursor: 'pointer' }}
            {...sortable.attributes}
            {...sortable.listeners}>
            grag
          </div>
        )}

        <Text wordWrap="unset" minWidth="max-content">
          {children}
        </Text>

        {!!onRemove && (
          <Button view="clear" size="s" onClick={onRemove}>
            x
          </Button>
        )}
      </Flex>
    </Box>
  );
}
