import { useCreateCosmeticApplicationMutation } from '#/client/entities/cosmetic/applications/store';
import {
  useListCosmeticProductsQuery,
  useListCosmeticRecipesQuery,
} from '#/client/store/cosmetic';
import { DateFormat } from '#/shared/models/date';
import { nonReachable } from '#/shared/utils';
import { Button } from '#/ui-lib/atoms/Button';
import { useDialog } from '#/ui-lib/atoms/Dialog';
import { FormDialogComponent } from '../components/Form';

export function CreatingActionContainer({
  date,
  dayPartId,
}: {
  date: DateFormat;
  dayPartId: string;
}) {
  const dialog = useDialog();

  const listCosmeticProductsQuery = useListCosmeticProductsQuery();
  const listCosmeticRecipesQuery = useListCosmeticRecipesQuery();

  const creatingMutation = useCreateCosmeticApplicationMutation({
    onMutate: dialog.close,
  });

  return (
    <>
      {dialog.isOpen && (
        <FormDialogComponent
          date={date}
          dayPartId={dayPartId}
          dialog={dialog}
          isPending={false}
          products={listCosmeticProductsQuery.data || []}
          recipes={listCosmeticRecipesQuery.data || []}
          onSubmit={values => {
            if (values.type === 'product') {
              creatingMutation.mutate({
                date,
                dayPartId,
                source: {
                  type: 'product',
                  productId: values.productId,
                },
              });
            } else if (values.type === 'recipe') {
              creatingMutation.mutate({
                date,
                dayPartId,
                source: {
                  type: 'recipe',
                  recipeId: values.recipeId,
                },
              });
            } else {
              nonReachable(values);
            }
          }}
        />
      )}

      <Button onClick={dialog.open}>Добавить косметику</Button>
    </>
  );
}
