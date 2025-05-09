import { ComponentProps } from 'react';
import { FormComponent } from './Form.component';

import { useUpdateIngredientStore } from '../../queries';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';

type FormContainerProps = Pick<
  ComponentProps<typeof FormComponent>,
  'disabled' | 'loading' | 'autoFocus'
> & {
  ingredientId: string;
  onSuccess: () => void;
};

export function FormContainer({ ingredientId, onSuccess, ...props }: FormContainerProps) {
  const updating = useUpdateIngredientStore(ingredientId, {
    onSuccess,
  });

  const cache = useCosmeticCacheStrict();
  const ingredient = cache.ingredients.find(ingredientId);

  return (
    <FormComponent
      {...props}
      initialValues={{ grams: ingredient?.storage.grams || 0 }}
      loading={updating.isPending}
      disabled={updating.isPending}
      onSubmit={values => {
        updating.mutate({
          ingredientId,
          grams: values.grams,
        });
      }}
    />
  );
}
