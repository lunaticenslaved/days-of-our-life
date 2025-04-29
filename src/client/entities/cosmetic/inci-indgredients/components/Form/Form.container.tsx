import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
import {
  useCreateCosmeticINCIIngredientMutation,
  useUpdateCosmeticINCIIngredientMutation,
} from '#/client/entities/cosmetic/inci-indgredients/store';
import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';
import { FormComponent } from './Form.component';

type FormContainerProps =
  | {
      type: 'update';
      ingredientId: string;
      onSubmitted: (ing: CosmeticINCIIngredient) => void;
    }
  | {
      type: 'create';
      onSubmitted: (ing: CosmeticINCIIngredient) => void;
    };

export function FormContainer(props: FormContainerProps) {
  const creatingMutation = useCreateCosmeticINCIIngredientMutation({
    onSuccess: props.onSubmitted,
  });

  if (props.type === 'create') {
    return (
      <FormComponent
        onSubmit={values => {
          creatingMutation.mutate({
            ...values,
            benefitIds: [],
          });
        }}
      />
    );
  }

  return <UpdateForm {...props} />;
}

function UpdateForm({
  ingredientId,
  onSubmitted,
}: {
  ingredientId: string;
  onSubmitted: (ing: CosmeticINCIIngredient) => void;
}) {
  const cache = useCosmeticCacheStrict();

  const ingredient = cache.inciIngredients.get(ingredientId);

  const updatingMutation = useUpdateCosmeticINCIIngredientMutation(ingredientId, {
    onSuccess: onSubmitted,
  });

  return (
    <FormComponent
      ingredient={ingredient}
      onSubmit={values => {
        updatingMutation.mutate({
          ingredient,
          newData: {
            ...values,
            benefitIds: [],
          },
        });
      }}
    />
  );
}
