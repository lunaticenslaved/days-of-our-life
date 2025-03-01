import { ProductForm as ProductFormComponent } from '../components/Form';
import { divideNutrients, FoodProduct } from '#/shared/models/food';
import {
  useCreateFoodProductMutation,
  useUpdateFoodProductMutation,
} from '#/client/store';

type FoodProductFormProps = UpdateFormProps | CreateFormProps;

export function FoodProductForm(props: FoodProductFormProps) {
  if (props.type === 'create') {
    return <CreateForm {...props} />;
  }

  return <UpdateForm {...props} />;
}

// --- Create -------------------------------------------------------
type CreateFormProps = {
  type: 'create';
  onOptimisticSuccess: () => void;
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

// --- Update -------------------------------------------------------
type UpdateFormProps = {
  type: 'update';
  product: FoodProduct;
  onSuccess: (product: FoodProduct) => void;
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
