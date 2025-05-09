import type { Meta, StoryObj } from '@storybook/react';
import { FormComponent } from './Form.component';
import { ComponentProps } from 'react';

type Props = ComponentProps<typeof FormComponent>;

const meta: Meta<typeof FormComponent> = {
  component: props => <FormComponent {...props} />,
};

export default meta;
type Story = StoryObj<typeof FormComponent>;

export const Default: Story = {
  args: {
    onSubmit: values => alert(JSON.stringify(values)),
    disabled: false,
    loading: false,
  } satisfies Props,
};

export const Disabled: Story = {
  args: {
    onSubmit: values => alert(JSON.stringify(values)),
    disabled: true,
    loading: false,
  } satisfies Props,
};

export const Loading: Story = {
  args: {
    onSubmit: values => alert(JSON.stringify(values)),
    disabled: true,
    loading: true,
  } satisfies Props,
};

export const Invalid: Story = {
  args: {
    onSubmit: values => alert(JSON.stringify(values)),
    initialValues: {
      grams: -1,
    },
  } satisfies Props,
};
