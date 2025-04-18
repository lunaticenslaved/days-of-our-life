import { Button } from '#/ui-lib/atoms/Button/Button';
import { useDialog } from '#/ui-lib/atoms/Dialog';

import { FoodProductFormDialog } from './Form';

export function FoodProductCreatingAction() {
  const formDialog = useDialog();

  return (
    <>
      <FoodProductFormDialog
        type="create"
        dialog={formDialog}
        onOptimisticSuccess={formDialog.close}
      />

      <Button view="outlined" onClick={formDialog.open}>
        Создать продукт
      </Button>
    </>
  );
}
