import { Button } from '#/client/components/Button';
import { FinalForm } from '#/client/components/FForm';
import { Form } from '#/client/components/Form';
import { TextArea } from '#/client/components/TextArea';
import { CosmeticRecipeCommentValidators } from '#/shared/models/cosmetic';
import { useMemo } from 'react';
import { z } from 'zod';

const schema = z.object({
  text: CosmeticRecipeCommentValidators.text,
});

type CosmeticRecipeCommentFormValues = z.infer<typeof schema>;

function getInitialValues(): CosmeticRecipeCommentFormValues {
  return {
    text: '',
  };
}

interface CosmeticRecipeCommentFormProps {
  onSubmit(values: CosmeticRecipeCommentFormValues): void;
}

export function CosmeticRecipeCommentForm({ onSubmit }: CosmeticRecipeCommentFormProps) {
  const initialValues = useMemo(() => getInitialValues(), []);

  return (
    <FinalForm schema={schema} onSubmit={onSubmit} initialValues={initialValues}>
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
          <Form.Content>
            <FinalForm.Field title="Текст" name="text">
              {TextArea}
            </FinalForm.Field>
          </Form.Content>

          <Form.Footer>
            {() => {
              return (
                <Button type="submit" onClick={handleSubmit}>
                  Сохранить
                </Button>
              );
            }}
          </Form.Footer>
        </Form>
      )}
    </FinalForm>
  );
}
