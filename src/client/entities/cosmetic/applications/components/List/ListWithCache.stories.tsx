import type { Meta, StoryObj } from '@storybook/react';
import { ListWithCache } from './ListWithCache';
import { ComponentProps, useState } from 'react';
import {
  CosmeticCacheProvider,
  CosmeticEventBusProvider,
  useCosmeticCacheStrict,
  useCosmeticEventBusStrict,
} from '#/client/entities/cosmetic';
import { Button, Flex } from '#/ui-lib/components';

type Props = ComponentProps<typeof ListWithCache>;

const meta: Meta<typeof ListWithCache> = {
  component: Component,
};

function Component(props: Props) {
  const [value, setValue] = useState(props.applications);

  return (
    <CosmeticEventBusProvider>
      <CosmeticCacheProvider
        applications={[
          {
            id: 'application-1',
            date: '10-01-2024',
            dayPartId: 'day-part-1',
            order: 1,
            source: {
              type: 'product',
              productId: 'product-1',
            },
          },
          {
            id: 'application-2',
            date: '10-01-2024',
            dayPartId: 'day-part-1',
            order: 2,
            source: {
              type: 'recipe',
              recipeId: 'recipe-1',
            },
          },
        ]}
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

        <ListWithCache {...props} applications={value} onOrderUpdate={setValue} />
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
type Story = StoryObj<typeof ListWithCache>;

export const Default: Story = {
  args: {
    applications: [
      {
        id: 'application-1',
      },
      {
        id: 'application-2',
      },
    ],
  } satisfies Props,
};
