import { Text } from '#/ui-lib/atoms/Text';

import { createEntityList } from '#/client/component-factories/EntityList';
import { CosmeticProduct, CosmeticRecipe } from '#/shared/models/cosmetic';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';
import { nonReachable } from '#/shared/utils';

export const ListComponent = createEntityList<
  CosmeticApplication,
  {
    productsMap: Record<string, CosmeticProduct>;
    recipesMap: Record<string, CosmeticRecipe>;
  }
>({
  entityName: 'CosmeticApplication',
  placeholder: {
    empty: '-',
  },
  getEntityKey(application) {
    return application.id;
  },
  renderEntity(application, { productsMap, recipesMap }) {
    if (application.source.type === 'product') {
      const product = productsMap[application.source.productId];

      if (!product) {
        return <Text>-</Text>;
      }

      return product.name;
    } else if (application.source.type === 'recipe') {
      const recipe = recipesMap[application.source.recipeId];

      if (!recipe) {
        return <Text>-</Text>;
      }

      return recipe.name;
    } else {
      nonReachable(application.source);
    }
  },
});
