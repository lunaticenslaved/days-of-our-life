import { LocalApplication } from '../../types';
import { getCosmeticApplicationKeywords } from '#/client/entities/cosmetic/applications/utils';
import { nonReachable } from '#/shared/utils';
import { Box } from '#/ui-lib/atoms/Box';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Text } from '#/ui-lib/atoms/Text';
import { List } from '#/ui-lib/molecules/List';
import { WithInputProps } from '#/ui-lib/types';
import { ReactNode } from 'react';
import { SortableCloud } from '#/ui-lib/molecules/SortableCloud';

type Application = Pick<LocalApplication, 'source' | 'id'>;

type ListComponentProps<T extends Application> = WithInputProps<
  string[] | undefined,
  {
    hideSearch?: boolean;
    applications: T[];
    renderActions?: (appl: T) => ReactNode;
    onOrderUpdate: (value: string[]) => void;
  }
>;

export function ListComponent<T extends Application>({
  hideSearch,
  value,
  onValueUpdate,
  applications,
  renderActions,
  onOrderUpdate,
}: ListComponentProps<T>) {
  return (
    <List value={value} onValueUpdate={onValueUpdate}>
      {!hideSearch && <List.Search placeholder="Поиск..." />}
      <List.Empty>Нет косметики</List.Empty>

      <List.Group>
        <SortableCloud
          value={applications.map(appl => appl.id)}
          onValueUpdate={newValue => {
            onOrderUpdate(newValue);
            onValueUpdate?.(newValue);
          }}
          strategy="vertical-list"
          renderElement={({ id, sortable }) => {
            const application = applications.find(appl => appl.id === id);

            if (!application) {
              throw new Error('Application not found!');
            }

            let content: ReactNode = <Text>-</Text>;

            if (application.source.type === 'product') {
              content = <Text>{application.source.product.name}</Text>;
            } else if (application.source.type === 'recipe') {
              content = <Text>{application.source.recipe.name}</Text>;
            } else {
              nonReachable(application.source);
            }

            return (
              <List.Item
                key={application.id}
                value={application.id}
                keywords={getCosmeticApplicationKeywords(application)}>
                <Flex gap={2} alignItems="center">
                  {!!sortable && (
                    <div
                      style={{ cursor: 'pointer' }}
                      {...sortable.attributes}
                      {...sortable.listeners}>
                      grag
                    </div>
                  )}

                  {content}
                  {!!renderActions && <Box>{renderActions?.(application)}</Box>}
                </Flex>
              </List.Item>
            );
          }}
        />
      </List.Group>
    </List>
  );
}
