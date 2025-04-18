import { getCosmeticApplicationKeywords } from '#/client/entities/cosmetic/applications/utils';
import { CosmeticProduct, CosmeticRecipe } from '#/shared/models/cosmetic';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';
import { nonReachable } from '#/shared/utils';
import { Box } from '#/ui-lib/atoms/Box';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Text } from '#/ui-lib/atoms/Text';
import { List } from '#/ui-lib/molecules/List';
import { WithInputProps } from '#/ui-lib/types';
import { ReactNode } from 'react';

type ListComponentProps = WithInputProps<
  string[] | undefined,
  {
    hideSearch?: boolean;
    applications: CosmeticApplication[];
    productsMap: Record<string, CosmeticProduct>;
    recipesMap: Record<string, CosmeticRecipe>;
    renderActions?: (appl: CosmeticApplication) => ReactNode;
  }
>;

export function ListComponent({
  hideSearch,
  value,
  onValueUpdate,
  applications,
  productsMap,
  recipesMap,
  renderActions,
}: ListComponentProps) {
  return (
    <List value={value} onValueUpdate={onValueUpdate}>
      {!hideSearch && (
        <Box spacing={{ px: 4, pt: 4 }}>
          <List.Search placeholder="Поиск..." />
        </Box>
      )}
      <List.Group>
        <Box spacing={{ px: 4, pb: 4 }} overflow="auto">
          {applications.map(application => {
            let content: ReactNode = <Text>-</Text>;

            if (application.source.type === 'product') {
              const product = productsMap[application.source.productId];

              if (product) {
                content = <Text>{product.name}</Text>;
              }
            } else if (application.source.type === 'recipe') {
              const recipe = recipesMap[application.source.recipeId];

              if (recipe) {
                content = <Text>{recipe.name}</Text>;
              }
            } else {
              nonReachable(application.source);
            }

            return (
              <List.Item
                key={application.id}
                value={application.id}
                keywords={getCosmeticApplicationKeywords(application)}>
                <Flex gap={2} alignItems="center">
                  {content}
                  {!!renderActions && <Box>{renderActions?.(application)}</Box>}
                </Flex>
              </List.Item>
            );
          })}
        </Box>
      </List.Group>
    </List>
  );
}
