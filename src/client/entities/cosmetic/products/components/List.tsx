import { createEntityList } from '#/client/component-factories/EntityList';
import { CosmeticProduct } from '#/shared/models/cosmetic';

import { getCosmeticProductKeywords } from '../utils';

export const ListComponent = createEntityList<CosmeticProduct>({
  entityName: 'CosmeticProduct',
  placeholder: {
    empty: 'Нет продуктов',
  },
  getEntityKeywords: getCosmeticProductKeywords,
  getEntityKey(product) {
    return product.id;
  },
  renderEntity(product) {
    return product.name;
  },
});
