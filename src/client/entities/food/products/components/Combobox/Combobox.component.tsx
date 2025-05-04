import { Box, Popup, Flex } from '#/ui-lib/components';
import { ComponentProps, ReactNode } from 'react';

import { ListComponent } from '../List/List.component';

type ListProps = ComponentProps<typeof ListComponent> & {
  trigger: ReactNode;
};

export function ComboboxComponent({ trigger, products, ...props }: ListProps) {
  return (
    <Popup>
      <Popup.Trigger>{trigger}</Popup.Trigger>

      <Popup.Content>
        {/* TODO добавить Paper компонент? */}
        <Box color="background">
          <Flex maxHeight="300px" overflow="auto">
            <ListComponent {...props} products={products} />
          </Flex>
        </Box>
      </Popup.Content>
    </Popup>
  );
}
