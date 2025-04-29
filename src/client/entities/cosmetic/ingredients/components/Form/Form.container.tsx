import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
import {
  useCreateCosmeticIngredientMutation,
  useGetCosmeticIngredientQuery,
  useUpdateCosmeticIngredientMutation,
} from '#/client/entities/cosmetic/ingredients/store';
import { CosmeticIngredient } from '#/shared/models/cosmetic';
import { FormComponent } from './Form.component';

type FormContainerProps =
  | {
      type: 'create';
      onSuccess: (ing: CosmeticIngredient) => void;
    }
  | {
      type: 'update';
      ingredientId: string;
      onOptimisticResponse?: () => void;
      onSuccess?: (ing: CosmeticIngredient) => void;
    };

export function FormContainer(props: FormContainerProps) {
  if (props.type === 'create') {
    return <CreateForm onSuccess={props.onSuccess} />;
  }

  return (
    <UpdateForm
      ingredientId={props.ingredientId}
      onOptimisticResponse={props.onOptimisticResponse}
      onSuccess={props.onSuccess}
    />
  );
}

function CreateForm({ onSuccess }: { onSuccess: (ing: CosmeticIngredient) => void }) {
  const creatingMutation = useCreateCosmeticIngredientMutation({
    onSuccess,
  });

  return (
    <FormComponent
      onSubmit={values => {
        creatingMutation.mutate(values);
      }}
    />
  );
}

function UpdateForm({
  ingredientId,
  onSuccess,
  onOptimisticResponse,
}: {
  ingredientId: string;
  onSuccess?: (arg: CosmeticIngredient) => void;
  onOptimisticResponse?: () => void;
}) {
  const updatingMutation = useUpdateCosmeticIngredientMutation(ingredientId, {
    onMutate: onOptimisticResponse,
    onSuccess,
  });

  useGetCosmeticIngredientQuery(ingredientId);

  const cache = useCosmeticCacheStrict();
  const ingredient = cache.ingredients.find(ingredientId);

  return (
    <FormComponent
      key={ingredient?.id}
      ingredient={ingredient}
      onSubmit={values => {
        if (!ingredient) {
          return;
        }

        updatingMutation.mutate({
          ingredient,
          newData: values,
        });
      }}
    />
  );
}
