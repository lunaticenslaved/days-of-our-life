import { ComponentProps } from 'react';
import { ActionsComponent } from './Actions.component';
import { useFoodNavigation } from '#/client/pages/food';
import { useDeleteFoodProductMutation, useUpdateFoodProductMutation } from '../../queries';

type ActionsComponentProps = ComponentProps<typeof ActionsComponent>;

export { ActionsComponent as FoodProductActions };

export function useFoodProductActionsContainer(arg: {
  productId: string;
  onDeleted: () => void;
}): Pick<ActionsComponentProps, 'disabled' | 'loading' | 'onDelete' | 'onEdit'> {
  const navigation = useFoodNavigation();

  const updating = useUpdateFoodProductMutation(arg.productId);
  const deleting = useDeleteFoodProductMutation(arg.productId, {
    onSuccess: arg.onDeleted,
  });

  return {
    loading: {
      edit: updating.isPending,
      delete: deleting.isPending,
    },
    disabled: {
      edit: deleting.isPending || updating.isPending,
      delete: deleting.isPending,
    },
    onDelete: product => {
      deleting.mutate({ id: product.id });
    },
    onEdit: product => {
      navigation.toProductEdit({ productId: product.id });
    },
  };
}
