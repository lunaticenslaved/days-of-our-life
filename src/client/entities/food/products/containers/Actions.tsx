import { ComponentProps } from 'react';
import { FoodProductActions as ActionsComponent } from '../components/Actions';
import { nonReachable } from '#/shared/utils';
import { useFoodNavigation } from '#/client/pages/food';
import { useDeleteFoodProductMutation } from '#/client/store';

type FoodProductActionsProps = Omit<
  ComponentProps<typeof ActionsComponent>,
  'onAction' | 'disabled'
>;

export function FoodProductActions(props: FoodProductActionsProps) {
  const navigation = useFoodNavigation();

  const deleteFoodProductMutation = useDeleteFoodProductMutation();

  return (
    <ActionsComponent
      {...props}
      onAction={(action, product) => {
        if (action === 'delete') {
          deleteFoodProductMutation.mutate({
            id: product.id,
          });
        } else if (action === 'edit') {
          navigation.toProductOverview({ productId: product.id });
        } else {
          nonReachable(action);
        }
      }}
      disabled={{
        edit: false,
        delete: deleteFoodProductMutation.isPending,
      }}
    />
  );
}
