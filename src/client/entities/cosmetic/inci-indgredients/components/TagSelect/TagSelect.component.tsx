import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';
import { Box } from '#/ui-lib/components/atoms/Box';
import { Button } from '#/ui-lib/components/atoms/Button/Button';
import { Flex } from '#/ui-lib/components/atoms/Flex';
import { Text } from '#/ui-lib/components/atoms/Text';
import { WithInputProps } from '#/ui-lib/types';
import _ from 'lodash';
import { ReactNode, useMemo } from 'react';
import {
  SortableCloud,
  SortableCloudElementRenderArg,
} from '#/ui-lib/components/molecules/SortableCloud';
import { Popup } from '#/ui-lib/components/atoms/Popup';
import { ListComponent } from '../List/List.component';

type TagSelectComponentProps = WithInputProps<
  string[] | undefined,
  {
    ingredients: CosmeticINCIIngredient[];
  }
>;

export function TagSelectComponent({
  value = [],
  onValueUpdate,
  ingredients,
}: TagSelectComponentProps) {
  const ingredientsMap = useMemo(() => {
    return _.fromPairs<CosmeticINCIIngredient | undefined>(
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
              onRemove={
                ingredient
                  ? () => {
                      onValueUpdate?.(value.filter(id => id !== ingredient.id));
                    }
                  : undefined
              }>
              {ingredient?.name}
            </Label>
          );
        }}
      />

      <Popup>
        <Popup.Trigger>
          <Button size="s" view="toned">
            Добавить +
          </Button>
        </Popup.Trigger>

        <Popup.Content>
          {/* TODO добавить Paper компонент? */}
          <Box color="background">
            <Flex maxHeight="300px" overflow="auto">
              <ListComponent
                ingredients={ingredients}
                value={value}
                onValueUpdate={arg => {
                  onValueUpdate?.(arg);
                }}
              />
            </Flex>
          </Box>
        </Popup.Content>
      </Popup>
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
