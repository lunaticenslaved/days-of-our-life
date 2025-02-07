import { Button } from '#/client/components/Button';
import { ConfirmDialog } from '#/client/components/ConfirmDialog';
import { useDialog } from '#/client/components/Dialog';
import { FC, Fragment } from 'react';

interface ActionConfig {
  text: string;
  confirm?: {
    title: string;
    description: string;
    submitText: string;
  };
}

interface CreateEntityActionsProps<TEntity, TAction extends string> {
  entityName: string;
  getActions(entity: TEntity): TAction[];
  actions: Record<TAction, ActionConfig>;
}

interface EntityActionsProps<TEntity, TAction extends string> {
  entity: TEntity;
  onAction(action: TAction, entity: TEntity): void;
  disabled: Record<TAction, boolean>;
}

export function createEntityActions<TEntity, TAction extends string>({
  entityName,
  actions,
  getActions,
}: CreateEntityActionsProps<TEntity, TAction>) {
  const Component: FC<EntityActionsProps<TEntity, TAction>> = ({
    entity,
    onAction,
    disabled,
  }) => {
    const confirmingDialog = useDialog();
    const actionKeys = getActions(entity);

    return (
      <>
        {actionKeys.map(key => {
          const { text, confirm } = actions[key];
          const callAction = () => {
            onAction(key, entity);
          };

          return (
            <Fragment key={key}>
              {confirm && confirmingDialog.isOpen && (
                <ConfirmDialog
                  dialog={confirmingDialog}
                  title={confirm.title}
                  text={confirm.description}
                  submitText={confirm.submitText}
                  onCancel={confirmingDialog.close}
                  onSubmit={() => {
                    confirmingDialog.close();
                    callAction();
                  }}
                />
              )}
              <Button
                disabled={disabled[key]}
                onClick={() => {
                  if (confirm) {
                    confirmingDialog.open();
                  } else {
                    callAction();
                  }
                }}>
                {text}
              </Button>
            </Fragment>
          );
        })}
      </>
    );
  };

  Component.displayName = `${entityName}ActionsFactory`;

  return Component;
}

export const EntityActionsTemplate = {
  edit: {
    text: 'Редактировать',
  },
  delete: {
    text: 'Удалить',
    confirm: {
      title: 'Удалить сущность?',
      description: 'Сущность будет удалена без возможности восстановления',
      submitText: 'Удалить',
    },
  },
} satisfies Record<string, ActionConfig>;
