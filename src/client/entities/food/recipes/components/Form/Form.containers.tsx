import { ComponentProps } from 'react';
import { FormComponent } from './Form.component';
import { useFoodCacheStrict } from '#/client/entities/food/cache';

type FormContainerProps = Pick<
  ComponentProps<typeof FormComponent>,
  'onSubmit' | 'recipe'
>;

export function FormContainer(props: FormContainerProps) {
  const cache = useFoodCacheStrict();

  return <FormComponent {...props} onFindProduct={cache.products.find} />;
}
