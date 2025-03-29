import { CosmeticProduct } from '#/shared/models/cosmetic';

export function getCosmeticProductKeywords(product: CosmeticProduct): string[] {
  return [product.name];
}
