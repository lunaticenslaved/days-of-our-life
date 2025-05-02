import { Flex, Popup, Box } from '#/ui-lib/components';
import { ComponentProps, ReactNode } from 'react';

import { ListComponent } from './List';

type ListProps = ComponentProps<typeof ListComponent> & {
  trigger: ReactNode;
};

export function CompoboxComponent({ trigger, ...props }: ListProps) {
  return (
    <Popup>
      <Popup.Trigger>{trigger}</Popup.Trigger>

      <Popup.Content>
        {/* TODO добавить Paper компонент? */}
        <Box color="background">
          <Flex maxHeight="300px" overflow="auto">
            <ListComponent {...props} />
          </Flex>
        </Box>
      </Popup.Content>
    </Popup>
  );
}
