import { CosmeticIngredient } from '#/shared/models/cosmetic';
import { Box } from '#/ui-lib/atoms/Box';
import { Button } from '#/ui-lib/atoms/Button/Button';
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

type IngredientTagSelectProps = WithInputProps<
  string[] | undefined,
  {
    ingredients: CosmeticIngredient[];
  }
>;

export function IngredientTagSelect({
  value = [],
  onValueUpdate,
  ingredients,
}: IngredientTagSelectProps) {
  const ingredientsMap = useMemo(() => {
    return _.fromPairs(
      ingredients.map(ingredient => {
        return [ingredient.id, ingredient];
      }),
    );
  }, [ingredients]);

  return (
    <Flex gap={2}>
      <SortableCloud
        strategy="rect-swapping"
        value={value}
        onValueUpdate={onValueUpdate}
        renderElement={({ id, sortable }) => {
          const ingredient = ingredientsMap[id];

          return (
            <Label
              sortable={sortable}
              onRemove={() => {
                onValueUpdate?.(value.filter(id => id !== ingredient.id));
              }}>
              {ingredient.name}
            </Label>
          );
        }}
      />

      <CompoboxComponent
        trigger={<Button size="s">Добавить +</Button>}
        ingredients={ingredients}
        value={value}
        onValueUpdate={arg => {
          onValueUpdate?.(arg);
        }}
      />
    </Flex>
  );
}

function Label({
  sortable,
  children,
  onRemove,
}: {
  sortable?: SortableCloudElementRenderArg['sortable'];
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
