import { Button } from '#/ui-lib/atoms/Button';
import { ConfirmDialog } from '#/client/components/ConfirmDialog';
import { useDialog } from '#/ui-lib/atoms/Dialog';
import { FC, Fragment } from 'react';
import _ from 'lodash';
import { usePendingCall } from '#/ui-lib/hooks';

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

type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : S extends `${infer P1}-${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : Lowercase<S>;

type ActionHandlerKey<TAction extends string> = `on${Capitalize<CamelCase<TAction>>}`;
type ActionHandler<TEntity> = (entity: TEntity) => void | Promise<void>;

type EntityActionsProps<TEntity, TAction extends string> = {
  entity: TEntity;
  disabled: Record<TAction, boolean>;
  loading: Record<TAction, boolean>;
} & Record<ActionHandlerKey<TAction>, ActionHandler<TEntity>>;

export function createEntityActions<TEntity, TAction extends string>({
  entityName,
  actions,
  getActions,
}: CreateEntityActionsProps<TEntity, TAction>) {
  const Component: FC<EntityActionsProps<TEntity, TAction>> = componentProps => {
    const { entity, disabled, loading } = componentProps;

    return (
      <>
        {getActions(entity).map(actionKey => {
          const actionHandlerKey = `on${_.capitalize(
            _.camelCase(actionKey),
          )}` as ActionHandlerKey<TAction>;
          const actionHandler = componentProps[
            actionHandlerKey
          ] as ActionHandler<TEntity>;

          return (
            <Action
              key={actionKey}
              config={actions[actionKey]}
              disabled={disabled[actionKey]}
              loading={loading[actionKey]}
              onAct={() => {
                actionHandler(entity);
              }}
            />
          );
        })}
      </>
    );
  };

  Component.displayName = `${entityName}ActionsFactory`;

  return Component;
}

function Action({
  config,
  onAct,
  disabled,
  loading,
}: {
  config: ActionConfig;
  onAct: () => void | Promise<void>;
  disabled: boolean;
  loading: boolean;
}) {
  const confirmingDialog = useDialog();
  const [isPending, act] = usePendingCall(onAct);

  return (
    <Fragment>
      {config.confirm && confirmingDialog.isOpen && (
        <ConfirmDialog
          dialog={confirmingDialog}
          title={config.confirm.title}
          text={config.confirm.description}
          submitText={config.confirm.submitText}
          onCancel={confirmingDialog.close}
          onSubmit={async () => {
            confirmingDialog.close();
            await onAct();
          }}
        />
      )}
      <Button
        loading={loading || isPending}
        disabled={disabled || isPending}
        onClick={() => {
          if (config.confirm) {
            confirmingDialog.open();
          } else {
            act();
          }
        }}>
        {config.text}
      </Button>
    </Fragment>
  );
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
