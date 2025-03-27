import { Button } from '#/ui-lib/atoms/Button';
import { FinalForm } from '#/client/components/FForm';
import { Dialog, IDialog } from '#/ui-lib/atoms/Dialog';
import { ReactNode, useMemo } from 'react';
import { ValidationErrors } from 'final-form';
import { z } from 'zod';

interface CreateEntityFormDialogProps<
  TEntity,
  TSchema extends Zod.ZodType,
  TAdditionalProps,
> {
  schema: TSchema;
  titleText: {
    create: string;
    update: string;
  };
  submitText: {
    create: string;
    update: string;
  };
  renderFields(
    arg: { values: z.infer<TSchema>; errors: ValidationErrors },
    props: TAdditionalProps,
  ): ReactNode;
  getInitialValues(
    entity: TEntity | undefined,
    props: TAdditionalProps,
  ): z.infer<TSchema>;
}

type ComponentProps<TEntity, TSchema extends Zod.ZodType> = {
  dialog: IDialog;
  onSubmit(values: z.infer<TSchema>): void;
  entity?: TEntity;
  isPending: boolean;
};

// FIXME use form from atoms
export function createEntityFormDialog<
  TEntity,
  TSchema extends Zod.ZodType,
  TAdditionalProps = object,
>({
  renderFields,
  getInitialValues,
  titleText,
  submitText,
  schema,
}: CreateEntityFormDialogProps<TEntity, TSchema, TAdditionalProps>) {
  const Component = ({
    dialog,
    onSubmit,
    entity,
    isPending,
    ...otherProps
  }: ComponentProps<TEntity, TSchema> & TAdditionalProps) => {
    const additionalProp = otherProps as TAdditionalProps;
    const initialValues = useMemo(() => {
      return getInitialValues(entity, additionalProp);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Dialog dialog={dialog}>
        <FinalForm
          schema={schema}
          onSubmit={onSubmit}
          initialValues={initialValues}
          disabled={isPending}>
          {({ handleSubmit, values, errors }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Dialog.Header>
                  {entity ? titleText.update : titleText.create}
                </Dialog.Header>
                <Dialog.Content>
                  {renderFields({ values, errors }, additionalProp)}
                </Dialog.Content>

                <Dialog.Footer>
                  <Button disabled={isPending} type="submit">
                    {entity ? submitText.update : submitText.create}
                  </Button>
                </Dialog.Footer>
              </form>
            );
          }}
        </FinalForm>
      </Dialog>
    );
  };

  return Component;
}
