import { Flex } from '#/ui-lib/components/atoms/Flex';
import { NumberInput } from './NumberInput';
import type { Meta, StoryObj } from '@storybook/react';

function Component() {
  return (
    <Flex direction="column" gap={4}>
      <NumberInput placeholder="Placeholder" />
      <NumberInput placeholder="Placeholder" required />
      <NumberInput placeholder="Placeholder" prepend="Price" append="rub" />
      <NumberInput
        placeholder="Errored field"
        prepend="Price"
        append="rub"
        state="error"
      />
      <NumberInput required placeholder="Required field" prepend="Price" append="rub" />
      <NumberInput
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
