import { Box } from '#/ui-lib/atoms/Box';
import { Flex } from '#/ui-lib/atoms/Flex';
import { List } from '#/ui-lib/molecules/List';
import { capitalize } from 'lodash';
import React, { ReactNode } from 'react';

interface CreateEntityList<TEntity, TProps> {
  entityName: string;
  placeholder: {
    empty: string;
  };
  getEntityKey: (item: TEntity) => string;
  getEntityKeywords?: (item: TEntity) => string[];
  renderEntity: (item: TEntity, props: TProps) => ReactNode;
}

interface EntityListProps<TEntity> {
  entities: TEntity[];
  renderActions?(item: TEntity): ReactNode;
}

export function createEntityList<TEntity, TProps = object>({
  entityName,
  placeholder,
  getEntityKey,
  getEntityKeywords,
  renderEntity,
}: CreateEntityList<TEntity, TProps>) {
  const EntityList: React.FC<
    EntityListProps<TEntity> &
      TProps & {
        onEntityClick?: (entity: TEntity) => void;
        renderEntity?: (item: TEntity, props: TProps) => ReactNode;
        hideSearch?: boolean;
      }
  > = ({
    hideSearch,
    entities,
    renderActions,
    onEntityClick,
    renderEntity: renderEntityProp,
    ...props
  }) => {
    if (!entities.length) {
      return <div>{placeholder.empty}</div>;
    }

    const localRenderEntityFn = renderEntityProp || renderEntity;

    return (
      <List>
        {getEntityKeywords && !hideSearch && <List.Search placeholder="Поиск..." />}
        <List.Empty>{placeholder.empty}</List.Empty>
        <List.Group>
          {entities.map(entity => {
            return (
              <List.Item
                key={getEntityKey(entity)}
                keywords={getEntityKeywords?.(entity)}
                value={getEntityKey(entity)}
                onClick={onEntityClick ? onEntityClick.bind(null, entity) : undefined}>
                <Flex alignItems="center">
                  <Box flexGrow={1}>{localRenderEntityFn(entity, props as TProps)}</Box>
                  <Box>{!!renderActions && renderActions(entity)}</Box>
                </Flex>
              </List.Item>
            );
          })}
        </List.Group>
      </List>
    );
  };

  EntityList.displayName = `${capitalize(entityName)}List`;

  return EntityList;
}
