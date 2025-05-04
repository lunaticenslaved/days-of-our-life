import type { Meta, StoryObj } from '@storybook/react';
import { FormComponent } from './Form.component';
import { ComponentProps } from 'react';

type Props = ComponentProps<typeof FormComponent>;

const meta: Meta<typeof FormComponent> = {
  component: (props: Props) => <FormComponent {...props} />,
};

export default meta;
type Story = StoryObj<typeof FormComponent>;

export const Default: Story = {
  args: {
    onSubmit: values => alert(JSON.stringify(values, null, 2)),
    onFindProduct: () => ({ name: 'Product name' }),
  } satisfies Props,
};
