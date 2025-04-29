import { CosmeticINCIIngredientForm } from '#/client/entities/cosmetic/inci-indgredients';
import { useCosmeticNavigation, useCosmeticPageParams } from '#/client/pages/cosmetic';
import { Page } from '#/client/widgets/Page';

export default function EditINCIIngredient() {
  const { inciIngredientId = '' } = useCosmeticPageParams();

  const navigation = useCosmeticNavigation();

  return (
    <Page>
      <Page.Header>
        <Page.Title>Редактирование INCI-ингредиента</Page.Title>
      </Page.Header>

      <Page.Content>
        <CosmeticINCIIngredientForm
          type="update"
          ingredientId={inciIngredientId}
          onSubmitted={() => {
            navigation.toINCIIngredients();
          }}
        />
      </Page.Content>
    </Page>
  );
}
