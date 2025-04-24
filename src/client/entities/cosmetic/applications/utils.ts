import { CosmeticProduct, CosmeticRecipe } from '#/shared/models/cosmetic';
import { nonReachable } from '#/shared/utils';

export function getCosmeticApplicationKeywords(
  arg:
    | {
        type: 'recipe';
        recipe: Pick<CosmeticRecipe, 'name'>;
      }
    | {
        type: 'product';
        product: Pick<CosmeticProduct, 'name' | 'manufacturer'>;
      },
): string[] {
  if (arg.type === 'product') {
    return [arg.product.name];
  } else if (arg.type === 'recipe') {
    return [arg.recipe.name];
  } else {
    nonReachable(arg);
  }
}
