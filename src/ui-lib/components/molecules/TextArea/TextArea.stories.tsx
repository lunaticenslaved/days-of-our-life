import { Flex } from '#/ui-lib/components/atoms/Flex';
import { TextArea } from './TextArea';
import type { Meta, StoryObj } from '@storybook/react';

function Component() {
  return (
    <Flex direction="column" gap={4}>
      <TextArea placeholder="Placeholder" required />
      <TextArea
        placeholder="Placeholder"
        value="Lorem iLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        append="Append"
        prepend="Prepend"
        required
      />
      <TextArea
        state={'error'}
        placeholder="Placeholder"
        value="Lorem iLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        append="Append"
        prepend="Prepend"
        required
      />
    </Flex>
  );
}

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Dashboard: Story = {
  args: {},
};
