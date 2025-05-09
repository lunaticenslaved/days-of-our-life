import type { Meta, StoryObj } from '@storybook/react';
import { ActionsComponent } from './Actions.component';
import { ComponentProps } from 'react';
import { DialogContextProvider } from '#/ui-lib/components';

type Props = ComponentProps<typeof ActionsComponent>;

const meta: Meta<typeof ActionsComponent> = {
  component: props => (
    <DialogContextProvider>
      <ActionsComponent {...props} />
    </DialogContextProvider>
  ),
};

export default meta;
type Story = StoryObj<typeof ActionsComponent>;

export const Default: Story = {
  args: {
    onEdit: () => alert('onEditedit'),
    onDelete: () => alert('onDelete'),
    entity: {
      id: 'id',
      name: 'name',
      description: 'description',
      benefitIds: [],
      INCIIngredientIds: [],
      storage: {
        grams: 0,
      },
    },
    disabled: {
      delete: false,
      edit: false,
    },
    loading: {
      delete: false,
      edit: false,
    },
  } satisfies Props,
};
