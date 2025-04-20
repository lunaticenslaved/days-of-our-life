import type { Meta, StoryObj } from '@storybook/react';
import { ListComponent } from './List';
import { ComponentProps } from 'react';

type Props = ComponentProps<typeof ListComponent>;

const meta: Meta<typeof ListComponent> = {
  component: (props: Props) => <ListComponent {...props} />,
};

export default meta;
type Story = StoryObj<typeof ListComponent>;

export const Default: Story = {
  args: {
    applications: [
      {
        id: 'appl-1',
        source: {
          type: 'recipe',
          recipeId: 'recipe-1',
          recipe: {
            id: 'recipe-1',
            name: 'Recipe 1',
          },
        },
      },
      {
        id: 'appl-2',
        source: {
          type: 'product',
          productId: 'product-1',
          product: {
            id: 'product-1',
            name: 'Product 1',
          },
        },
      },
    ],
    onOrderUpdate: () => null,
  } satisfies Props,
};
