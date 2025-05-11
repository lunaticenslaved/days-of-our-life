import { Box, Popup } from '#/ui-lib/components';
import { ComponentProps, ReactNode } from 'react';

import { ListComponent } from '../List/List.component';

type ListProps = Omit<ComponentProps<typeof ListComponent>, 'maxHeight'> & {
  trigger: ReactNode;
};

export function ComboboxComponent({ trigger, products, ...props }: ListProps) {
  return (
    <Popup>
      <Popup.Trigger>{trigger}</Popup.Trigger>

      <Popup.Content>
        {/* TODO добавить Paper компонент? */}
        <Box color="background">
          <ListComponent {...props} products={products} maxHeight="300px" />
        </Box>
      </Popup.Content>
    </Popup>
  );
}
