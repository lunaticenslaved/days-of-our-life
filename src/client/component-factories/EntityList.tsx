import { capitalize } from 'lodash';
import React, { ReactNode } from 'react';

interface CreateEntityList<TEntity> {
  entityName: string;
  placeholder: {
    empty: string;
  };
  getEntityKey(item: TEntity): string;
  renderEntity(item: TEntity): ReactNode;
}

interface EntityListProps<TEntity> {
  entities: TEntity[];
  renderActions?(item: TEntity): ReactNode;
}

export function createEntityList<TEntity>({
  entityName,
  placeholder,
  getEntityKey,
  renderEntity,
}: CreateEntityList<TEntity>) {
  const EntityList: React.FC<EntityListProps<TEntity>> = ({
    entities,
    renderActions,
  }) => {
    if (!entities.length) {
      return <div>{placeholder.empty}</div>;
    }

    return (
      <ul>
        {entities.map(entity => {
          return (
            <li key={getEntityKey(entity)} style={{ display: 'flex' }}>
              <div>{renderEntity(entity)}</div>
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
