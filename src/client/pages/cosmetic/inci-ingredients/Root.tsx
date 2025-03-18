import {
  CosmeticINCIIngredientActions,
  CosmeticINCIIngredientCreateAction,
  CosmeticINCIIngredientsList,
} from '#/client/entities/cosmetic';
import { useListCosmeticINCIIngredientsQuery } from '#/client/store';
import { Page } from '#/client/widgets/Page';

export default function CosmeticINCIIngredientRootPage() {
  const listQuery = useListCosmeticINCIIngredientsQuery();

  if (!listQuery.data) {
    return <div>Loading...</div>;
  }

  return (
    <Page title="INCI-ингредиенты" actions={<CosmeticINCIIngredientCreateAction />}>
      <CosmeticINCIIngredientsList
        entities={listQuery.data}
        renderActions={ingredient => {
          return <CosmeticINCIIngredientActions ingredient={ingredient} />;
        }}
      />
    </Page>
  );
}
