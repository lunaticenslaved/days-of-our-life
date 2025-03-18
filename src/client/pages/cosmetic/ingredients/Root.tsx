import {
  CosmeticIngredientActions,
  CosmeticIngredientsList,
  CreateCosmeticIngredientAction,
} from '#/client/entities/cosmetic';
import { Page } from '#/client/widgets/Page';

export default function CosmeticIngredientRootPage() {
  return (
    <Page title="Косметические ингредиенты" actions={<CreateCosmeticIngredientAction />}>
      <CosmeticIngredientsList
        renderAction={ingredient => {
          return <CosmeticIngredientActions ingredient={ingredient} />;
        }}
      />
    </Page>
  );
}
