import type { Meta, StoryObj } from '@storybook/react';
import { ListComponent } from './List';
import { ComponentProps, useState } from 'react';
import {
  CosmeticCacheProvider,
  CosmeticEventBusProvider,
  useCosmeticCacheStrict,
  useCosmeticEventBusStrict,
} from '#/client/entities/cosmetic';
import { Button } from '#/ui-lib/atoms/Button';
import { Flex } from '#/ui-lib/atoms/Flex';

type Props = ComponentProps<typeof ListComponent>;

const meta: Meta<typeof ListComponent> = {
  component: Component,
};

function Component(props: Props) {
  const [value, setValue] = useState(props.applications);

  return (
    <CosmeticEventBusProvider>
      <CosmeticCacheProvider
        products={[
          {
            id: 'product-1',
            name: 'Product 1',
            manufacturer: 'Manufactureer - 1',
          },
        ]}
        recipes={[
          {
            id: 'recipe-1',
            name: 'Recipe 1',
            description: '',
            phases: [],
          },
        ]}>
        <UpdateProductButton />

        <ListComponent {...props} applications={value} onOrderUpdate={setValue} />
      </CosmeticCacheProvider>
    </CosmeticEventBusProvider>
  );
}

function UpdateProductButton() {
  const cache = useCosmeticCacheStrict();
  const eventBus = useCosmeticEventBusStrict();

  return (
    <Flex spacing={{ mb: 4 }} gap={2}>
      <Button
        onClick={() => {
          cache.products.update({
            id: 'product-1',
            name: 'Product 1 !!!',
            manufacturer: 'Manufactureer - 1 !!!',
          });
        }}>
        Update product
      </Button>
      <Button
        onClick={() => {
          eventBus.emit('product-deleted', { productId: 'product-1' });
          cache.products.remove('product-1');
        }}>
        Remove product
      </Button>
    </Flex>
  );
}

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
        },
      },
      {
        id: 'appl-2',
        source: {
          type: 'product',
          productId: 'product-1',
        },
      },
    ],
  } satisfies Props,
};
