import {
  CosmeticIngredientsList,
  CosmeticIngredientCreatingAction,
} from '#/client/entities/cosmetic/ingredients';
import { Page } from '#/client/widgets/Page';

export default function CosmeticIngredientRootPage() {
  return (
    <Page>
      <Page.Header>
        <Page.Title>Косметические ингредиенты</Page.Title>
        <Page.Actions>
          <CosmeticIngredientCreatingAction />
        </Page.Actions>
      </Page.Header>

      <Page.Content>
        <CosmeticIngredientsList />
      </Page.Content>
    </Page>
  );
}
