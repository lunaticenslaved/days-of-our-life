import { ForwardedRef, ReactNode, forwardRef, useEffect, useState } from 'react';

import {
  Select as BaseSelect,
  SelectMultipleProps,
  SelectSingleProps,
} from '#/ui-lib/atoms/Select';

interface EntitySingleSelectProps<TEntity> extends Omit<SelectSingleProps, 'multiple'> {
  name?: string;
  disabled?: boolean;
  entities: TEntity[];
}

interface EntityMultipleSelectProps<TEntity>
  extends Omit<SelectMultipleProps, 'multiple'> {
  name?: string;
  disabled?: boolean;
  entities: TEntity[];
}

type CreateSelectProps<TEntity> = {
  getValue(entity: TEntity): string;
  renderOption(entity: TEntity): ReactNode;
};

function renderOptions<TEntity>(
  entities: TEntity[],
  {
    renderOption,
    getValue,
  }: Pick<CreateSelectProps<TEntity>, 'renderOption' | 'getValue'>,
) {
  return (
    <>
      {entities.map(entity => {
        const value = getValue(entity);

        return (
          <BaseSelect.Option key={value} value={value}>
            {renderOption(entity)}
          </BaseSelect.Option>
        );
      })}
    </>
  );
}

export function createEntitySingleSelect<TEntity>(
  entityName: string,
  creationProps: CreateSelectProps<TEntity>,
) {
  const Select = forwardRef(function SelectComponent(
    { entities: entitiesProp = [], ...propsInitial }: EntitySingleSelectProps<TEntity>,
    ref: ForwardedRef<HTMLSelectElement>,
  ) {
    const [entities, setEntities] = useState<TEntity[]>(entitiesProp);

    useEffect(() => {
      setEntities(entitiesProp);
    }, [entitiesProp]);

    return (
      <BaseSelect {...propsInitial} ref={ref}>
        {renderOptions(entities, creationProps)}
      </BaseSelect>
    );
  });

  Select.displayName = `${entityName}SingleSelectFactory`;

  return Select;
}

export function createEntityMultipleSelect<TEntity>(
  entityName: string,
  creationProps: CreateSelectProps<TEntity>,
) {
  const Select = forwardRef(function SelectComponent(
    { entities: entitiesProp = [], ...propsInitial }: EntityMultipleSelectProps<TEntity>,
    ref: ForwardedRef<HTMLSelectElement>,
  ) {
    const [entities, setEntities] = useState<TEntity[]>(entitiesProp);

    useEffect(() => {
      setEntities(entitiesProp);
    }, [entitiesProp]);

    return (
      <BaseSelect {...propsInitial} multiple ref={ref}>
        {renderOptions(entities, creationProps)}
      </BaseSelect>
    );
  });

  Select.displayName = `${entityName}MultipleSelectFactory`;

  return Select;
}
