// FIXME use another import
import { ListComponent as CosmeticRecipesList } from '#/client/entities/cosmetic/recipes/components/List';
import { ListComponent as CosmeticProductList } from '#/client/entities/cosmetic/products/components/List';
import { CosmeticProduct, CosmeticRecipe } from '#/shared/models/cosmetic';
import { Box } from '#/ui-lib/atoms/Box';
import { Button } from '#/ui-lib/atoms/Button';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Popup } from '#/ui-lib/atoms/Popup';
import { RadioGroup } from '#/ui-lib/atoms/Radio';
import { useState } from 'react';

type LocalCosmeticProduct = Pick<CosmeticProduct, 'id' | 'name' | 'manufacturer'>;
type LocalCosmeticRecipe = Pick<CosmeticRecipe, 'id' | 'name'>;

interface ApplicationItemSelectProps {
  products: LocalCosmeticProduct[];
  recipes: LocalCosmeticRecipe[];
  onItemSelect: (
    item:
      | { type: 'product'; item: LocalCosmeticProduct }
      | { type: 'recipe'; item: LocalCosmeticRecipe },
  ) => void;
  closeOnItemSelect?: boolean;
}

export function ApplicationItemSelect({
  recipes,
  products,
  onItemSelect,
  closeOnItemSelect,
}: ApplicationItemSelectProps) {
  const [source, setSource] = useState<'product' | 'recipe'>('recipe');

  return (
    <Popup>
      <Popup.Trigger>
        <Button view="toned">Добавить косметику</Button>
      </Popup.Trigger>

      <Popup.Content>
        {({ close }) => {
          return (
            // FIXME use paper component
            <Box color="background" minWidth="400px" spacing={{ p: 4 }}>
              <Flex direction="column" spacing={{ mb: 4 }}>
                <RadioGroup
                  value={source}
                  onValueUpdate={newValue => {
                    setSource(newValue || 'recipe');
                  }}>
                  <RadioGroup.Button value="product">Продукт</RadioGroup.Button>
                  <RadioGroup.Button value="recipe">Рецепт</RadioGroup.Button>
                </RadioGroup>
              </Flex>

              {source === 'product' && (
                <CosmeticProductList
                  entities={products}
                  onEntityClick={product => {
                    onItemSelect({
                      type: 'product',
                      item: product,
                    });
                  }}
                />
              )}
              {source === 'recipe' && (
                <CosmeticRecipesList
                  entities={recipes}
                  onEntityClick={recipe => {
                    onItemSelect({
                      type: 'recipe',
                      item: recipe,
                    });

                    if (closeOnItemSelect) {
                      close();
                    }
                  }}
                />
              )}
            </Box>
          );
        }}
      </Popup.Content>
    </Popup>
  );
}
