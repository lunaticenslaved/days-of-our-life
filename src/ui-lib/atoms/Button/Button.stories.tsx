import { Button, BUTTON_VIEWS } from './Button';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Text } from '#/ui-lib/atoms/Text';
import { SIZES } from '#/ui-lib/utils/size';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '#/ui-lib/atoms/Box';

function Component() {
  return (
    <Flex gap={2} direction="column">
      {BUTTON_VIEWS.map(view => {
        return (
          <Flex key={view} alignItems="center">
            <Box width="100px">
              <Text>{view}</Text>
            </Box>

            <Flex gap={2} alignItems="center">
              {SIZES.map(size => {
                return (
                  <Button color="primary" view={view} key={size} size={size}>
                    Size {size.toLocaleUpperCase()}
                  </Button>
                );
              })}
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
}

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Dashboard: Story = {
  args: {
    size: 'l',
    children: 'Click me',
  },
};
