import {
  useListCosmeticProductsQuery,
  useListCosmeticRecipesQuery,
} from '#/client/store';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';
import { nonReachable } from '#/shared/utils';
import { useDialog } from '#/ui-lib/atoms/Dialog';
import { ActionsComponent } from '../components/Actions';
import { FormDialogComponent, FormValues } from '../components/Form';

import {
  useUpdateCosmeticApplicationMutation,
  useDeleteCosmeticApplicationMutation,
} from '../store';

type ActionsContainerProps = {
  application: CosmeticApplication;
  onDeleted: () => void;
};

export function ActionsContainer({ application, onDeleted }: ActionsContainerProps) {
  const updateDialog = useDialog();

  const updatingMutation = useUpdateCosmeticApplicationMutation(application.id, {
    onMutate: updateDialog.close,
  });
  const deletingMutation = useDeleteCosmeticApplicationMutation(application.id, {
    onSuccess: onDeleted,
  });

  const listCosmeticProductsQuery = useListCosmeticProductsQuery();
  const listCosmeticRecipesQuery = useListCosmeticRecipesQuery();

  let initialValues: FormValues | undefined = undefined;

  if (application.source.type === 'product') {
    initialValues = {
      type: 'product',
      productId: application.source.productId,
    };
  } else if (application.source.type === 'recipe') {
    initialValues = {
      type: 'recipe',
      recipeId: application.source.recipeId,
    };
  } else {
    nonReachable(application.source);
  }

  return (
    <>
      {updateDialog.isOpen && (
        <FormDialogComponent
          entity={application}
          date={application.date}
          dayPartId={application.dayPartId}
          dialog={updateDialog}
          isPending={false}
          products={listCosmeticProductsQuery.data || []}
          recipes={listCosmeticRecipesQuery.data || []}
          initialValues={initialValues}
          onSubmit={values => {
            if (values.type === 'product') {
              updatingMutation.mutate({
                application: application,
                newData: {
                  date: application.date,
                  dayPartId: application.dayPartId,
                  source: {
                    type: 'product',
                    productId: values.productId,
                  },
                },
              });
            } else if (values.type === 'recipe') {
              updatingMutation.mutate({
                application: application,
                newData: {
                  date: application.date,
                  dayPartId: application.dayPartId,
                  source: {
                    type: 'recipe',
                    recipeId: values.recipeId,
                  },
                },
              });
            } else {
              nonReachable(values);
            }
          }}
        />
      )}

      <ActionsComponent
        entity={application}
        onDelete={() => {
          deletingMutation.mutate(application);
        }}
        onEdit={() => {
          updateDialog.open();
        }}
        loading={{
          edit: updatingMutation.isPending,
          delete: deletingMutation.isPending,
        }}
        disabled={{
          edit: updatingMutation.isPending,
          delete: deletingMutation.isPending,
        }}
      />
    </>
  );
}
