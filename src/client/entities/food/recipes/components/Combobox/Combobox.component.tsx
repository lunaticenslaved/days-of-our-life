import { FoodRecipesList } from '../List';
import { Flex, Popup, Box } from '#/ui-lib/components';
import { ComponentProps, ReactNode } from 'react';

type CompoboxComponentProps = ComponentProps<typeof FoodRecipesList> & {
  trigger: ReactNode;
  closeOnValueUpdate?: boolean;
};

export function CompoboxComponent({
  trigger,
  closeOnValueUpdate,
  ...props
}: CompoboxComponentProps) {
  return (
    <Popup>
      <Popup.Trigger>{trigger}</Popup.Trigger>

      <Popup.Content>
        {({ close }) => {
          return (
            <Box color="background">
              {/* TODO добавить Paper компонент? */}
              <Flex maxHeight="300px" overflow="auto">
                <FoodRecipesList
                  autoFocus="search"
                  {...props}
                  onValueUpdate={(...args) => {
                    props.onValueUpdate?.(...args);

                    if (closeOnValueUpdate) {
                      close();
                    }
                  }}
                />
              </Flex>
            </Box>
          );
        }}
      </Popup.Content>
    </Popup>
  );
}
