import type { Meta, StoryObj } from '@storybook/react';
import { ApplicationItemSelect } from './ApplicationItemSelect';
import { ComponentProps } from 'react';

type Props = ComponentProps<typeof ApplicationItemSelect>;

const meta: Meta<typeof ApplicationItemSelect> = {
  component: (props: Props) => <ApplicationItemSelect {...props} />,
};

export default meta;
type Story = StoryObj<typeof ApplicationItemSelect>;

export const Default: Story = {
  args: {
    products: [
      { id: 'product-1', name: 'Product 1', manufacturer: 'Manufacturer 1' },
      { id: 'product-2', name: 'Product 2', manufacturer: 'Manufacturer 2' },
    ],
    recipes: [
      { id: 'recipe-1', name: 'Recipe 1' },
      { id: 'recipe-2', name: 'Recipe 2' },
    ],
    onItemSelect: arg => {
      alert(JSON.stringify(arg, null, 4));
    },
  } satisfies Props,
};
