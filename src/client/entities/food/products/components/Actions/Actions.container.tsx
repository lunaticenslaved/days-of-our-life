import { ComponentProps } from 'react';
import { ActionsComponent } from './Actions.component';
import { useFoodNavigation } from '#/client/pages/food';
import {
  useDeleteFoodProductMutation,
  useUpdateFoodProductMutation,
} from '#/client/entities/food/products';

type FoodProductActionsProps = Omit<
  ComponentProps<typeof ActionsComponent>,
  'loading' | 'disabled' | 'onDelete' | 'onEdit'
>;

export function ActionsContainer(props: FoodProductActionsProps) {
  const navigation = useFoodNavigation();

  const deleting = useDeleteFoodProductMutation(props.entity.id);
  const updating = useUpdateFoodProductMutation(props.entity.id);

  return (
    <ActionsComponent
      {...props}
      onDelete={product => {
        deleting.mutate({
          id: product.id,
        });
      }}
      onEdit={product => {
        navigation.toProductEdit({ productId: product.id });
      }}
      loading={{
        edit: updating.isPending,
        delete: deleting.isPending,
      }}
      disabled={{
        edit: deleting.isPending || updating.isPending,
        delete: deleting.isPending,
      }}
    />
  );
}
