import { nonReachable } from '#/shared/utils';
import { LocalApplication } from './types';

export function getCosmeticApplicationKeywords(
  application: Pick<LocalApplication, 'source'>,
): string[] {
  if (application.source.type === 'product') {
    return [application.source.product.name];
  } else if (application.source.type === 'recipe') {
    return [application.source.recipe.name];
  } else {
    nonReachable(application.source);
  }
}
