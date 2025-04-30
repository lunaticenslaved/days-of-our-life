import { Flex } from '#/ui-lib/components/atoms/Flex';
import { TextInput } from './TextInput';
import type { Meta, StoryObj } from '@storybook/react';

function Component() {
  return (
    <Flex direction="column" gap={4}>
      <TextInput placeholder="Placeholder" />
      <TextInput placeholder="Placeholder" required />
      <TextInput placeholder="Placeholder" prepend="Price" append="rub" />
      <TextInput placeholder="Errored field" prepend="Price" append="rub" state="error" />
      <TextInput required placeholder="Required field" prepend="Price" append="rub" />
      <TextInput
        required
        placeholder="Required errored field"
        prepend="Price"
        append="rub"
        state="error"
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
