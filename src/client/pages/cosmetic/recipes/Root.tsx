import { Page } from '#/client/widgets/Page';
import {
  CosmeticRecipesCreatingAction,
  CosmeticRecipesList,
} from '#/client/entities/cosmetic/recipes';

export default function CosmeticRecipesPage() {
  return (
    <Page>
      <Page.Header>
        <Page.Title>Косметические рецепты</Page.Title>
        <Page.Actions>
          <CosmeticRecipesCreatingAction />
        </Page.Actions>
      </Page.Header>

      <Page.Content>
        <CosmeticRecipesList />
      </Page.Content>
    </Page>
  );
}
