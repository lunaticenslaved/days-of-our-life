import {
  CosmeticINCIIngredientCreatingAction,
  CosmeticINCIIngredientsList,
} from '#/client/entities/cosmetic/inci-indgredients';
import { Page } from '#/client/widgets/Page';

export default function CosmeticINCIIngredientRootPage() {
  return (
    <Page>
      <Page.Header>
        <Page.Title>INCI-ингредиенты</Page.Title>
        <Page.Actions>
          <CosmeticINCIIngredientCreatingAction />
        </Page.Actions>
      </Page.Header>

      <Page.Content>
        <CosmeticINCIIngredientsList />
      </Page.Content>
    </Page>
  );
}
