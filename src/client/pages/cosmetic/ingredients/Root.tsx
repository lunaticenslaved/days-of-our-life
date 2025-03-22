import {
  CosmeticIngredientsList,
  CosmeticIngredientCreatingAction,
} from '#/client/entities/cosmetic/ingredients';
import { Page } from '#/client/widgets/Page';

export default function CosmeticIngredientRootPage() {
  return (
    <Page
      title="Косметические ингредиенты"
      actions={<CosmeticIngredientCreatingAction />}>
      <CosmeticIngredientsList />
    </Page>
  );
}
