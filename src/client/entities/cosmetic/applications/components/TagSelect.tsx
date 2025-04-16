import { Box } from '#/ui-lib/atoms/Box';
import { Button } from '#/ui-lib/atoms/Button';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Text } from '#/ui-lib/atoms/Text';
import { WithInputProps } from '#/ui-lib/types';
import _ from 'lodash';
import { ReactNode, useMemo } from 'react';
import { CompoboxComponent } from './Combobox';
import {
  SortableCloud,
  SortableCloudElementRenderArg,
} from '#/ui-lib/molecules/SortableCloud';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';
import { CosmeticProduct, CosmeticRecipe } from '#/shared/models/cosmetic';
import { nonReachable } from '#/shared/utils';

type INCIIngredientTagSelectProps = WithInputProps<
  string[] | undefined,
  {
    applications: CosmeticApplication[];
    productsMap: Record<string, CosmeticProduct>;
    recipesMap: Record<string, CosmeticRecipe>;
  }
>;

export function ApplicationTagSelect({
  value = [],
  onValueUpdate,
  applications,
  productsMap,
  recipesMap,
}: INCIIngredientTagSelectProps) {
  const applicationsMap = useMemo(() => {
    return _.fromPairs(
      applications.map(application => {
        return [application.id, application];
      }),
    );
  }, [applications]);

  return (
    <SortableCloud
      value={value}
      onValueUpdate={onValueUpdate}
      renderElement={({ id }) => {
        const application = applicationsMap[id];

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
          <Label
            // sortable={arg}
            onRemove={() => {
              onValueUpdate?.(value.filter(id => id !== application.id));
            }}>
            {content}
          </Label>
        );
      }}
      renderDraggedElement={({ id }) => {
        const application = applicationsMap[id];

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

        return <Label onRemove={() => null}>{content}</Label>;
      }}
      append={
        <CompoboxComponent
          recipesMap={recipesMap}
          productsMap={productsMap}
          trigger={<Button size="s">Добавить +</Button>}
          applications={applications}
          value={value}
          onValueUpdate={arg => {
            onValueUpdate?.(arg);
          }}
        />
      }
    />
  );
}

// FIXME move to ui-lib
function Label({
  sortable,
  children,
  onRemove,
}: {
  sortable?: Pick<SortableCloudElementRenderArg, 'attributes' | 'listeners'>;
  children: ReactNode;
  onRemove?: () => void;
}) {
  return (
    <Box color="background">
      <Flex gap={2} alignItems="center">
        {!!sortable && (
          <div
            style={{ cursor: 'pointer' }}
            {...sortable.attributes}
            {...sortable.listeners}>
            grag
          </div>
        )}

        <Text wordWrap="unset" minWidth="max-content">
          {children}
        </Text>

        {!!onRemove && (
          <Button view="clear" size="s" onClick={onRemove}>
            x
          </Button>
        )}
      </Flex>
    </Box>
  );
}
