import { ComponentProps } from 'react';
import { FormComponent } from './Form.component';
import { useFoodRecipeComboboxContainer } from '#/client/entities/food/recipes';

import { useFoodProductComplexValidateRequest } from '../../queries';
import { Action } from '#/shared/api/types';

export { FormComponent as FoodProductComplexForm };

type FormComponentProps = ComponentProps<typeof FormComponent>;

export function useFoodProductComplexFormContainer(): Pick<
  FormComponentProps,
  'isFetchingRecipes' | 'recipes' | 'validate'
> {
  const recipesCombobox = useFoodRecipeComboboxContainer();
  const validation = useFoodProductComplexValidateRequest();

  return {
    isFetchingRecipes: recipesCombobox.isFetching,
    recipes: recipesCombobox.recipes,
    validate: values => {
      const response = await validation.mutateAsync({
        action: Action.Food_ProductComplex_Validate,
        data: values,
      });
    },
  };
}
