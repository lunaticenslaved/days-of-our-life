import { ComponentProps } from 'react';
import { FoodProductActions as ActionsComponent } from '../components/Actions';
import { useFoodNavigation } from '#/client/pages/food';
import { useDeleteFoodProductMutation } from '#/client/store';

type FoodProductActionsProps = Omit<
  ComponentProps<typeof ActionsComponent>,
  'loading' | 'disabled' | 'onDelete' | 'onEdit'
>;

export function FoodProductActions(props: FoodProductActionsProps) {
  const navigation = useFoodNavigation();

  const deleteFoodProductMutation = useDeleteFoodProductMutation();

  return (
    <ActionsComponent
      {...props}
      onDelete={product => {
        deleteFoodProductMutation.mutate({
          id: product.id,
        });
      }}
      onEdit={product => {
        navigation.toProductOverview({ productId: product.id });
      }}
      loading={{
        edit: false,
        delete: deleteFoodProductMutation.isPending,
      }}
      disabled={{
        edit: false,
        delete: deleteFoodProductMutation.isPending,
      }}
    />
  );
}
