import {
  CosmeticINCIIngredientCreateAction,
  CosmeticINCIIngredientsList,
} from '#/client/entities/cosmetic/inci-indgredients';
import { useListCosmeticINCIIngredientsQuery } from '#/client/store';
import { Page } from '#/client/widgets/Page';

export default function CosmeticINCIIngredientRootPage() {
  const listQuery = useListCosmeticINCIIngredientsQuery();

  if (!listQuery.data) {
    return <div>Loading...</div>;
  }

  return (
    <Page title="INCI-ингредиенты" actions={<CosmeticINCIIngredientCreateAction />}>
      <CosmeticINCIIngredientsList />
    </Page>
  );
}
