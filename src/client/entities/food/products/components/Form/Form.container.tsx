import { FormComponent } from './Form.component';
import { divideNutrients, FoodProduct } from '#/shared/models/food';
import {
  useCreateFoodProductMutation,
  useUpdateFoodProductMutation,
} from '#/client/entities/food/products';

type FormContainerProps =
  | {
      type: 'create';
      onSuccess: (product: FoodProduct) => void;
    }
  | {
      type: 'update';
      product: FoodProduct;
      onOptimisticResponse: () => void;
    };

export function FormContainer(props: FormContainerProps) {
  if (props.type === 'create') {
    return <CreatingForm onSuccess={props.onSuccess} />;
  }

  return (
    <UpdatingForm
      product={props.product}
      onOptimisticResponse={props.onOptimisticResponse}
    />
  );
}

function CreatingForm({ onSuccess }: { onSuccess: (product: FoodProduct) => void }) {
  const creation = useCreateFoodProductMutation({
    onSuccess,
  });

  return (
    <FormComponent
      onSubmit={async values => {
        await creation.mutateAsync({
          name: values.name,
          manufacturer: values.manufacturer || undefined,
          nutrientsPerGram: divideNutrients(values.nutrientsPer100Gramm, 100),
        });
      }}
    />
  );
}

function UpdatingForm({
  product,
  onOptimisticResponse,
}: {
  product: FoodProduct;
  onOptimisticResponse: () => void;
}) {
  const updating = useUpdateFoodProductMutation(product.id, {
    onMutate: onOptimisticResponse,
  });

  return (
    <FormComponent
      product={product}
      onSubmit={async values => {
        await updating.mutate({
          id: product.id,
          name: values.name,
          manufacturer: values.manufacturer || undefined,
          nutrientsPerGram: divideNutrients(values.nutrientsPer100Gramm, 100),
        });
      }}
    />
  );
}
