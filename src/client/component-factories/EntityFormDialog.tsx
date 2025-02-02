import { Button } from '#/client/components/Button';
import { Dialog, IUseDialog } from '#/client/components/Dialog';
import { FinalForm } from '#/client/components/FForm';
import { Form } from '#/client/components/Form';
import { ReactNode, useMemo } from 'react';
import { z } from 'zod';

interface CreateEntityFormDialogProps<TEntity, TSchema extends Zod.SomeZodObject> {
  schema: TSchema;
  titleText: {
    create: string;
    update: string;
  };
  submitText: {
    create: string;
    update: string;
  };
  renderFields(): ReactNode;
  getInitialValues(entity?: TEntity): z.infer<TSchema>;
}

interface ComponentProps<TEntity, TSchema extends Zod.SomeZodObject> {
  dialog: IUseDialog;
  onSubmit(values: z.infer<TSchema>): void;
  entity?: TEntity;
  isPending?: boolean;
}

export function createEntityFormDialog<TEntity, TSchema extends Zod.SomeZodObject>({
  renderFields,
  getInitialValues,
  titleText,
  submitText,
  schema,
}: CreateEntityFormDialogProps<TEntity, TSchema>) {
  const Component = ({
    dialog,
    onSubmit,
    entity,
    isPending,
  }: ComponentProps<TEntity, TSchema>) => {
    const initialValues = useMemo(() => {
      return getInitialValues(entity);
    }, [entity]);

    return (
      <Dialog dialog={dialog}>
        <FinalForm
          schema={schema}
          onSubmit={onSubmit}
          initialValues={initialValues}
          disabled={isPending}>
          {({ handleSubmit }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <Dialog.Header>
                  {entity ? titleText.update : titleText.create}
                </Dialog.Header>
                <Dialog.Content>
                  <Form.Content>{renderFields()}</Form.Content>
                </Dialog.Content>

                <Dialog.Footer>
                  <Form.Footer>
                    {({ disabled }) => (
                      <Button disabled={disabled} type="submit">
                        {entity ? submitText.update : submitText.create}
                      </Button>
                    )}
                  </Form.Footer>
                </Dialog.Footer>
              </Form>
            );
          }}
        </FinalForm>
      </Dialog>
    );
  };

  return Component;
}
