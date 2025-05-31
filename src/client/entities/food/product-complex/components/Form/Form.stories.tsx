import type { Meta, StoryObj } from '@storybook/react';
import { FormComponent } from './Form.component';
import { ComponentProps } from 'react';
import { FormErrors } from './types';

type Props = ComponentProps<typeof FormComponent>;

const meta: Meta<typeof FormComponent> = {
  component: props => <FormComponent {...props} />,
};

export default meta;
type Story = StoryObj<typeof FormComponent>;

export const Default: Story = {
  args: {
    onSubmit: values => alert(JSON.stringify(values)),
    validate: () => {
      const errors: FormErrors = {
        title: 'Required',
      };

      return Promise.resolve(errors);
    },
    recipes: [
      {
        id: 'name',
        name: 'Recipe 1',
      },
    ],
    isFetchingRecipes: false,
    isSubmitting: false,
  } satisfies Props,
};

export const Submitting: Story = {
  args: {
    onSubmit: values => alert(JSON.stringify(values)),
    validate: () => {
      return Promise.resolve({});
    },
    recipes: [
      {
        id: 'name',
        name: 'Recipe 1',
      },
    ],
    isFetchingRecipes: false,
    isSubmitting: true,
  } satisfies Props,
};
