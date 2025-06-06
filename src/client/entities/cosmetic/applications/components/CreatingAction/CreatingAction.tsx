// FIXME use another import
import { ListComponent as CosmeticRecipesList } from '#/client/entities/cosmetic/recipes/components/List';
import { ListComponent as CosmeticProductList } from '#/client/entities/cosmetic/products/components/List';
import { CosmeticProduct, CosmeticRecipe } from '#/shared/models/cosmetic';
import { Box, Button, Flex, Popup, RadioGroup } from '#/ui-lib/components';
import { useState } from 'react';

type LocalCosmeticProduct = Pick<CosmeticProduct, 'id' | 'name' | 'manufacturer'>;
type LocalCosmeticRecipe = Pick<CosmeticRecipe, 'id' | 'name'>;

interface CreatingActionProps {
  products: LocalCosmeticProduct[];
  recipes: LocalCosmeticRecipe[];
  onItemSelect: (
    item: { type: 'product'; productId: string } | { type: 'recipe'; recipeId: string },
  ) => void;
  closeOnItemSelect?: boolean;
}

export function CreatingAction({
  recipes,
  products,
  onItemSelect,
  closeOnItemSelect,
}: CreatingActionProps) {
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
                      productId: product.id,
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
                      recipeId: recipe.id,
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
