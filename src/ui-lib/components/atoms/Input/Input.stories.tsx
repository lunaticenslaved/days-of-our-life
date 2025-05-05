import { Flex } from '#/ui-lib/components/atoms/Flex';
import { Input } from './Input';
import type { Meta, StoryObj } from '@storybook/react';

function Component() {
  return (
    <Flex direction="column" gap={4}>
      <Input placeholder="Placeholder" />
      <Input placeholder="Placeholder" required />
      <Input placeholder="Placeholder" prepend="Price" append="rub" />
      <Input placeholder="Errored field" prepend="Price" append="rub" state="error" />
      <Input
        label="Label"
        required
        placeholder="Required field"
        prepend="Price"
        append="rub"
      />
      <Input
        label="Very very long label"
        required
        placeholder="Required field"
        prepend="Price"
        append="rub"
      />
      <Input
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
