import {
  ProductForm as ProductFormComponent,
  ProductFormDialog as ProductFormDialogComponent,
} from '../components/Form';
import { divideNutrients, FoodProduct } from '#/shared/models/food';
import {
  useCreateFoodProductMutation,
  useUpdateFoodProductMutation,
} from '#/client/store';
import { IDialog } from '#/ui-lib/components/atoms/Dialog';

type FoodProductFormProps = UpdateFormProps | CreateFormProps;
type FoodProductFormDialogProps = UpdateFormDialogProps | CreateFormDialogProps;

export function FoodProductForm(props: FoodProductFormProps) {
  if (props.type === 'create') {
    return <CreateForm {...props} />;
  }

  return <UpdateForm {...props} />;
}

export function FoodProductFormDialog(props: FoodProductFormDialogProps) {
  if (props.type === 'create') {
    return <CreateFormDialog {...props} />;
  }

  return <UpdateFormDialog {...props} />;
}

// --- Create -------------------------------------------------------
type CreateFormProps = {
  type: 'create';
  onOptimisticSuccess: () => void;
};
type CreateFormDialogProps = CreateFormProps & {
  dialog: IDialog;
};

function CreateForm({ onOptimisticSuccess }: CreateFormProps) {
  const creation = useCreateFoodProductMutation({
    onMutate: onOptimisticSuccess,
  });

  return (
    <ProductFormComponent
      onSubmit={values => {
        creation.mutate({
          name: values.name,
          manufacturer: values.manufacturer || undefined,
          nutrientsPerGram: divideNutrients(values.nutrientsPer100Gramm, 100),
        });
      }}
    />
  );
}

function CreateFormDialog({ onOptimisticSuccess, dialog }: CreateFormDialogProps) {
  const creation = useCreateFoodProductMutation({
    onMutate: onOptimisticSuccess,
  });

  return (
    <ProductFormDialogComponent
      dialog={dialog}
      onSubmit={values => {
        creation.mutate({
          name: values.name,
          manufacturer: values.manufacturer || undefined,
          nutrientsPerGram: divideNutrients(values.nutrientsPer100Gramm, 100),
        });
      }}
    />
  );
}

// --- Update -------------------------------------------------------
type UpdateFormProps = {
  type: 'update';
  product: FoodProduct;
  onSuccess: (product: FoodProduct) => void;
};
type UpdateFormDialogProps = UpdateFormProps & {
  dialog: IDialog;
};

function UpdateForm({ onSuccess, product }: UpdateFormProps) {
  const updating = useUpdateFoodProductMutation({
    onSuccess,
  });

  return (
    <ProductFormComponent
      product={product}
      onSubmit={values => {
        updating.mutate({
          id: product.id,
          name: values.name,
          manufacturer: values.manufacturer || undefined,
          nutrientsPerGram: divideNutrients(values.nutrientsPer100Gramm, 100),
        });
      }}
    />
  );
}

function UpdateFormDialog({ onSuccess, product, dialog }: UpdateFormDialogProps) {
  const updating = useUpdateFoodProductMutation({
    onSuccess,
  });

  return (
    <ProductFormDialogComponent
      dialog={dialog}
      product={product}
      onSubmit={values => {
        updating.mutate({
          id: product.id,
          name: values.name,
          manufacturer: values.manufacturer || undefined,
          nutrientsPerGram: divideNutrients(values.nutrientsPer100Gramm, 100),
        });
      }}
    />
  );
}
