import { Box, Popup, Flex } from '#/ui-lib/components';
import { ComponentProps, ReactNode, useMemo } from 'react';

import { ListComponent } from '../List/List.component';
import { orderCosmeticIngredients } from '../../utils';

type ListProps = ComponentProps<typeof ListComponent> & {
  trigger: ReactNode;
};

export function ComboboxComponent({ trigger, ingredients, ...props }: ListProps) {
  const items = useMemo(() => {
    return orderCosmeticIngredients(ingredients);
  }, [ingredients]);

  return (
    <Popup>
      <Popup.Trigger>{trigger}</Popup.Trigger>

      <Popup.Content>
        {/* TODO добавить Paper компонент? */}
        <Box color="background">
          <Flex maxHeight="300px" overflow="auto">
            <ListComponent {...props} ingredients={items} />
          </Flex>
        </Box>
      </Popup.Content>
    </Popup>
  );
}
