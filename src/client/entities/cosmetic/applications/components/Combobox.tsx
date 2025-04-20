import { Box } from '#/ui-lib/atoms/Box';
import { Combobox } from '#/ui-lib/atoms/Combobox';
import { Flex } from '#/ui-lib/atoms/Flex';
import { ComponentProps, ReactNode } from 'react';

import { ListComponent } from './List/List';

type ListProps = ComponentProps<typeof ListComponent> & {
  trigger: ReactNode;
};

export function CompoboxComponent({ trigger, ...props }: ListProps) {
  return (
    <Combobox>
      <Combobox.Trigger>{trigger}</Combobox.Trigger>

      <Combobox.Content>
        {/* TODO добавить Paper компонент? */}
        <Box color="background">
          <Flex maxHeight="300px" overflow="auto">
            <ListComponent {...props} />
          </Flex>
        </Box>
      </Combobox.Content>
    </Combobox>
  );
}
