import { createEntityList } from '#/client/component-factories/EntityList';
import { CosmeticRecipeComment } from '#/shared/models/cosmetic';
import { Text } from '#/ui-lib/components/atoms/Text';

export const ListComponent = createEntityList<CosmeticRecipeComment>({
  entityName: 'CosmeticRecipeComment',
  placeholder: {
    empty: 'Нет продуктов',
  },
  getEntityKey(comment) {
    return comment.id;
  },
  renderEntity(comment) {
    return (
      <>
        <Text component="p">{comment.text}</Text>
        <Text component="div">{comment.createdAt}</Text>
      </>
    );
  },
});
