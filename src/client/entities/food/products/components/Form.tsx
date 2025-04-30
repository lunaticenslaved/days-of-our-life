import {
  FoodNutrientsInputFormField,
  FoodNutrientsInputValidator,
} from '#/client/entities/food/nutrients';
import {
  FoodProduct,
  FoodProductValidators,
  multiplyNutrients,
  roundNutrients,
} from '#/shared/models/food';
import { Box } from '#/ui-lib/atoms/Box';
import { Button } from '#/ui-lib/atoms/Button/Button';
import { Dialog, IDialog } from '#/ui-lib/atoms/Dialog';
import { Form } from '#/ui-lib/atoms/Form/FinalForm';
import { TextInput } from '#/ui-lib/molecules/TextInput';
import { useMemo } from 'react';
import { z } from 'zod';
import { Field } from '#/ui-lib/atoms/Field';

const schema = z.object({
  name: FoodProductValidators.name,
  manufacturer: FoodProductValidators.manufacturer,
  nutrientsPer100Gramm: FoodNutrientsInputValidator,
});

type FormValues = z.infer<typeof schema>;

function getInitialValues(product?: FoodProduct): FormValues {
  if (product) {
    const nutrientsPer100Gramm = roundNutrients(
      multiplyNutrients(product.nutrientsPerGram, 100),
    );

    return {
      name: product.name,
      manufacturer: product.manufacturer || null,
      nutrientsPer100Gramm,
    };
  }

  return {
    name: '',
    manufacturer: '',
    nutrientsPer100Gramm: {
      calories: 0,
      proteins: 0,
      fats: 0,
      carbs: 0,
      fibers: 0,
    },
  };
}

/**
 *
 *
 * --- Fields ------------------------------------------------------------- */
function Fields() {
  return (
    <>
      <Form.Field name="name" required>
        {fieldProps => {
          return (
            <Field {...fieldProps.field}>
              <Field.Label>Имя</Field.Label>
              <Field.Input>
                <TextInput
                  {...fieldProps.input}
                  onValueUpdate={newValue => {
                    fieldProps.input.onValueUpdate(newValue || '');
                  }}
                />
              </Field.Input>
              <Field.Message />
            </Field>
          );
        }}
      </Form.Field>

      <Form.Field name="manufacturer">
        {fieldProps => {
          return (
            <Field {...fieldProps.field}>
              <Field.Label>Производитель</Field.Label>
              <Field.Input>
                <TextInput
                  {...fieldProps.input}
                  onValueUpdate={newValue => {
                    fieldProps.input.onValueUpdate(newValue || '');
                  }}
                />
              </Field.Input>
              <Field.Message />
            </Field>
          );
        }}
      </Form.Field>

      <FoodNutrientsInputFormField name="nutrientsPer100Gramm" />
    </>
  );
}
/**
 *
 *
 * --- Footer ------------------------------------------------------------- */
function Footer() {
  return (
    <>
      <Button type="submit">Сохранить</Button>
    </>
  );
}

/**
 *
 *
 * --- Form --------------------------------------------------------------- */
interface ProductFormProps {
  product?: FoodProduct;
  onSubmit(values: FormValues): void | Promise<void>;
}

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const initialValues = useMemo(() => {
    return getInitialValues(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  return (
    <Form schema={schema} initialValues={initialValues} onSubmit={onSubmit}>
      {() => {
        return (
          <Box color="background">
            <Fields />
            <Footer />
          </Box>
        );
      }}
    </Form>
  );
}

/**
 *
 *
 * --- Form Dialog --------------------------------------------------------- */
interface ProductFormDialogProps extends ProductFormProps {
  dialog: IDialog;
}

export function ProductFormDialog({ dialog, product, onSubmit }: ProductFormDialogProps) {
  const initialValues = useMemo(() => {
    return getInitialValues(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  return (
    <Dialog dialog={dialog}>
      <Dialog.Header>
        {product ? 'Редактирование продукта' : 'Новый продукт'}
      </Dialog.Header>

      <Form schema={schema} initialValues={initialValues} onSubmit={onSubmit}>
        {() => {
          return (
            <>
              <Dialog.Content style={{ minWidth: '500px' }}>
                <Box color="background">
                  <Fields />
                </Box>
              </Dialog.Content>

              <Dialog.Footer>
                <Footer />
              </Dialog.Footer>
            </>
          );
        }}
      </Form>
    </Dialog>
  );
}
