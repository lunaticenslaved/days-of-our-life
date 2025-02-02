import { ForwardedRef, ReactNode, forwardRef, useEffect, useState } from 'react';

import {
  Select as BaseSelect,
  SelectMultipleProps,
  SelectSingleProps,
} from '../components/Select';

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
    propsInitial: EntitySingleSelectProps<TEntity>,
    ref: ForwardedRef<HTMLSelectElement>,
  ) {
    const props = { ...propsInitial };

    const [entities, setEntities] = useState<TEntity[]>(props.entities || []);

    useEffect(() => {
      setEntities(props.entities || []);
    }, [props.entities]);

    const component = (
      <BaseSelect {...props} ref={ref}>
        {renderOptions(entities, creationProps)}
      </BaseSelect>
    );

    return (
      <div className="flex gap-x-2">
        <div className="flex-1">{component}</div>
      </div>
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
    propsInitial: EntityMultipleSelectProps<TEntity>,
    ref: ForwardedRef<HTMLSelectElement>,
  ) {
    const props = { ...propsInitial };

    const [entities, setEntities] = useState<TEntity[]>(props.entities || []);

    useEffect(() => {
      setEntities(props.entities || []);
    }, [props.entities]);

    const component = (
      <BaseSelect {...props} multiple ref={ref}>
        {renderOptions(entities, creationProps)}
      </BaseSelect>
    );

    return (
      <div className="flex gap-x-2">
        <div className="flex-1">{component}</div>
      </div>
    );
  });

  Select.displayName = `${entityName}MultipleSelectFactory`;

  return Select;
}
