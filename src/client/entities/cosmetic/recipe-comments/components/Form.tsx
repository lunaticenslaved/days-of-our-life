import { Button } from '#/ui-lib/atoms/Button';
import { CosmeticRecipeCommentValidators } from '#/shared/models/cosmetic';
import { useMemo } from 'react';
import { z } from 'zod';
import { Form } from '#/ui-lib/atoms/Form';
import { Field } from '#/ui-lib/atoms/Field';
import { TextInput } from '#/ui-lib/molecules/TextInputField';

const schema = z.object({
  text: CosmeticRecipeCommentValidators.text,
});

type FormValues = z.infer<typeof schema>;

function getInitialValues(): FormValues {
  return {
    text: '',
  };
}

interface CosmeticRecipeCommentFormProps {
  onSubmit(values: FormValues): void;
}

export function FormComponent({ onSubmit }: CosmeticRecipeCommentFormProps) {
  const initialValues = useMemo(() => getInitialValues(), []);

  return (
    <Form schema={schema} onSubmit={onSubmit} initialValues={initialValues}>
      {() => (
        <>
          <Form.Field<string | null> name="text">
            {fieldProps => {
              // FIXME use text area
              return (
                <Field direction="horizontal">
                  <Field.Label>Текст</Field.Label>
                  <Field.Input>
                    <TextInput {...fieldProps.input} />
                  </Field.Input>
                  <Field.Message />
                </Field>
              );
            }}
          </Form.Field>

          <Button type="submit">Сохранить</Button>
        </>
      )}
    </Form>
  );
}
