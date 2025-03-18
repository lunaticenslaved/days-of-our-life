import { capitalize } from 'lodash';
import React, { ReactNode } from 'react';

interface CreateEntityList<TEntity, TProps> {
  entityName: string;
  placeholder: {
    empty: string;
  };
  getEntityKey(item: TEntity): string;
  renderEntity(item: TEntity, props: TProps): ReactNode;
}

interface EntityListProps<TEntity> {
  entities: TEntity[];
  renderActions?(item: TEntity): ReactNode;
}

export function createEntityList<TEntity, TProps = object>({
  entityName,
  placeholder,
  getEntityKey,
  renderEntity,
}: CreateEntityList<TEntity, TProps>) {
  const EntityList: React.FC<EntityListProps<TEntity> & TProps> = ({
    entities,
    renderActions,
    ...props
  }) => {
    if (!entities.length) {
      return <div>{placeholder.empty}</div>;
    }

    return (
      <ul>
        {entities.map(entity => {
          return (
            <li
              key={getEntityKey(entity)}
              style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flexGrow: 1 }}>{renderEntity(entity, props as TProps)}</div>
              <div>{!!renderActions && renderActions(entity)}</div>
            </li>
          );
        })}
      </ul>
    );
  };

  EntityList.displayName = `${capitalize(entityName)}List`;

  return EntityList;
}
