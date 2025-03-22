import { createEntityList } from '#/client/component-factories/EntityList';
import { CosmeticProductApplication } from '#/shared/models/cosmetic';

// FIXME use good render

export const ListComponent = createEntityList<CosmeticProductApplication>({
  entityName: 'CosmeticProductApplication',
  placeholder: {
    empty: 'Нет продуктов',
  },
  getEntityKey(application) {
    return application.id;
  },
  renderEntity(application) {
    return application.cosmeticProductId;
  },
});
