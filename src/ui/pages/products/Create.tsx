import { CosmeticProductFieldValidators } from '#shared/models/CosmeticProduct';
import { FForm } from '#ui/components/forms/FForm';
import { FFTextArea } from '#ui/components/forms/FFTextArea';
import { FFTextInput } from '#ui/components/forms/FFTextInput';
import { z } from 'zod';

const schema = z.object({
  name: CosmeticProductFieldValidators.name,
  manufacturer: CosmeticProductFieldValidators.manufacturer,
  coreIngredients: CosmeticProductFieldValidators.coreIngredients,
});

type ProductFormValues = z.infer<typeof schema>;

interface ProductFormProps {
  onSubmit(values: ProductFormValues): void;
}

function ProductForm({ onSubmit }: ProductFormProps) {
  return (
    <FForm schema={schema} onSubmit={onSubmit}>
      {({ values, errors }) => (
        <>
          <div>{JSON.stringify(values)}</div>
          <div>{JSON.stringify(errors)}</div>

          <FFTextInput name="name" title="Имя" required />
          <FFTextInput name="manufacturer" title="Производитель" required />
          <FFTextArea name="coreIngredients" title="Ключевые ингредиенты" />
        </>
      )}
    </FForm>
  );
}

export default function Create() {
  return (
    <ProductForm
      onSubmit={values => {
        fetch('/api/cosmetic-products', {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }}
    />
  );
}
