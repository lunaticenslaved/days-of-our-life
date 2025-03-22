import {
  useListCosmeticProductsQuery,
  useRemoveCosmeticProductFromDateMutation,
} from '#/client/store';
import { CosmeticProductApplication } from '#/shared/models/cosmetic';
import { useDialog } from '#/ui-lib/atoms/Dialog';
import { ActionsComponent } from '../components/Actions';
import { FormDialogComponent } from '../components/Form';

type ActionsContainerProps = {
  application: CosmeticProductApplication;
  onDeleted: () => void;
};

export function ActionsContainer({ application, onDeleted }: ActionsContainerProps) {
  const updateDialog = useDialog();

  const listCosmeticProductsQuery = useListCosmeticProductsQuery();

  const removeCosmeticProductFromDateMutation = useRemoveCosmeticProductFromDateMutation({
    onMutate: onDeleted,
  });

  return (
    <>
      {updateDialog.isOpen && (
        <FormDialogComponent
          dialog={updateDialog}
          products={listCosmeticProductsQuery.data || []}
          onSubmit={() => {
            // FIXME add editing
            alert('cannot edit yet');
          }}
        />
      )}

      <ActionsComponent
        entity={application}
        onDelete={() => {
          removeCosmeticProductFromDateMutation.mutate(application);
        }}
        onEdit={() => {
          updateDialog.open();
        }}
        loading={{
          edit: false,
          delete: removeCosmeticProductFromDateMutation.isPending,
        }}
        disabled={{
          edit: false,
          delete: removeCosmeticProductFromDateMutation.isPending,
        }}
      />
    </>
  );
}
