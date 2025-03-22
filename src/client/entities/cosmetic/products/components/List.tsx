import { createEntityList } from '#/client/component-factories/EntityList';
import { CosmeticProduct } from '#/shared/models/cosmetic';

export const ListComponent = createEntityList<CosmeticProduct>({
  entityName: 'CosmeticProduct',
  placeholder: {
    empty: 'Нет продуктов',
  },
  getEntityKey(product) {
    return product.id;
  },
  renderEntity(product) {
    return product.name;
  },
});
