import { Box } from '#/ui-lib/components/atoms/Box';
import { Combobox } from '#/ui-lib/components/atoms/Combobox';
import { Flex } from '#/ui-lib/components/atoms/Flex';
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
    <Combobox>
      <Combobox.Trigger>{trigger}</Combobox.Trigger>

      <Combobox.Content>
        {/* TODO добавить Paper компонент? */}
        <Box color="background">
          <Flex maxHeight="300px" overflow="auto">
            <ListComponent {...props} ingredients={items} />
          </Flex>
        </Box>
      </Combobox.Content>
    </Combobox>
  );
}
