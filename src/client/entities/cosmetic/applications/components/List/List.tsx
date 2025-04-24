import { nonReachable } from '#/shared/utils';
import { Box } from '#/ui-lib/atoms/Box';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Text } from '#/ui-lib/atoms/Text';
import { List } from '#/ui-lib/molecules/List';
import { ReactNode } from 'react';
import { SortableCloud } from '#/ui-lib/molecules/SortableCloud';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';
import { getCosmeticApplicationKeywords } from '#/client/entities/cosmetic/applications/utils';
import { keyBy } from 'lodash';

type Application = Pick<CosmeticApplication, 'source' | 'id'>;

type ListComponentProps<T extends Application> = {
  applications: T[];
  hideSearch?: boolean;
  renderActions?: (appl: T) => ReactNode;
  onOrderUpdate?: (value: T[]) => void;
};

export function ListComponent<T extends Application>({
  hideSearch,
  applications,
  onOrderUpdate,
  renderActions,
}: ListComponentProps<T>) {
  const cosmeticCache = useCosmeticCacheStrict();

  const map = keyBy(applications, item => item.id);

  return (
    <List>
      {!hideSearch && <List.Search placeholder="Поиск..." />}
      <List.Empty>Нет косметики</List.Empty>

      <List.Group>
        <SortableCloud
          value={applications?.map(appl => appl.id)}
          onValueUpdate={newValue => {
            onOrderUpdate?.(newValue.map(id => map[id]));
          }}
          strategy="vertical-list"
          renderElement={({ id, sortable }) => {
            const application = map[id];

            let content: ReactNode = <Text>-</Text>;
            let keywords: string[] = [];

            // FIXME add skeleton
            if (application.source.type === 'product') {
              const product = cosmeticCache.products.find(application.source.productId);

              if (product) {
                content = <Text>{product.name}</Text>;
                keywords = getCosmeticApplicationKeywords({
                  type: 'product',
                  product,
                });
              }
            } else if (application.source.type === 'recipe') {
              const recipe = cosmeticCache.recipes.find(application.source.recipeId);

              if (recipe) {
                content = <Text>{recipe.name}</Text>;
                keywords = getCosmeticApplicationKeywords({
                  type: 'recipe',
                  recipe,
                });
              }
            } else {
              nonReachable(application.source);
            }

            return (
              <List.Item key={application.id} value={application.id} keywords={keywords}>
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
