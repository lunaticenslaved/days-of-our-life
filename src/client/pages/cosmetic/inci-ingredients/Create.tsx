import { CosmeticINCIIngredientForm } from '#/client/entities/cosmetic/inci-indgredients';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import { Page } from '#/client/widgets/Page';

export default function CreateINCIIngredient() {
  const navigation = useCosmeticNavigation();

  return (
    <Page>
      <Page.Header>
        <Page.Title>Добавление INCI-ингредиента</Page.Title>
      </Page.Header>

      <Page.Content>
        <CosmeticINCIIngredientForm
          type="create"
          onSubmitted={() => {
            navigation.toINCIIngredients();
          }}
        />
      </Page.Content>
    </Page>
  );
}
