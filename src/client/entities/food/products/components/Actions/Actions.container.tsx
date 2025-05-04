import { ComponentProps } from 'react';
import { ActionsComponent } from './Actions.component';
import { useFoodNavigation } from '#/client/pages/food';
import {
  useDeleteFoodProductMutation,
  useUpdateFoodProductMutation,
} from '#/client/entities/food/products';
import { useFoodCacheStrict } from '#/client/entities/food/cache';

type FoodProductActionsProps = Omit<
  ComponentProps<typeof ActionsComponent>,
  'loading' | 'disabled' | 'onDelete' | 'onEdit' | 'entity'
> & {
  productId: string;
  onDeleted: () => void;
};

export function ActionsContainer({
  productId,
  onDeleted,
  ...props
}: FoodProductActionsProps) {
  const product = useFoodCacheStrict().products.get(productId);

  const navigation = useFoodNavigation();

  const updating = useUpdateFoodProductMutation(productId);
  const deleting = useDeleteFoodProductMutation(productId, {
    onSuccess: onDeleted,
  });

  return (
    <ActionsComponent
      {...props}
      entity={product}
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
