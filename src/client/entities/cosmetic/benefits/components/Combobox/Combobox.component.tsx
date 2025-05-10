import { Flex, Popup, Box } from '#/ui-lib/components';
import { ComponentProps, ReactNode } from 'react';

import { CosmeticBenefitsList } from '../List';

type CompoboxComponentProps = ComponentProps<typeof CosmeticBenefitsList> & {
  trigger: ReactNode;
  isFetchingBenefits: boolean;
};

export function CompoboxComponent({
  trigger,
  isFetchingBenefits,
  ...props
}: CompoboxComponentProps) {
  return (
    <Popup>
      <Popup.Trigger>{trigger}</Popup.Trigger>

      <Popup.Content>
        {/* TODO добавить Paper компонент? */}
        <Box color="background">
          <Flex maxHeight="300px" overflow="auto">
            {isFetchingBenefits ? (
              <div>loading...</div>
            ) : (
              <CosmeticBenefitsList
                autoFocus="search"
                isFetchingBenefits={isFetchingBenefits}
                {...props}
              />
            )}
          </Flex>
        </Box>
      </Popup.Content>
    </Popup>
  );
}
