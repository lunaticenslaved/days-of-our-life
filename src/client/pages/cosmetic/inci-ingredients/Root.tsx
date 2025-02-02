import {
  CosmeticINCIIngredientActions,
  CosmeticINCIIngredientCreateAction,
  CosmeticINCIIngredientsList,
} from '#/client/entities/cosmetic';
import { useListCosmeticINCIIngredientsQuery } from '#/client/store';

export default function Page() {
  const listQuery = useListCosmeticINCIIngredientsQuery();

  if (!listQuery.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CosmeticINCIIngredientCreateAction />
      <CosmeticINCIIngredientsList
        entities={listQuery.data}
        renderActions={ingredient => {
          return <CosmeticINCIIngredientActions ingredient={ingredient} />;
        }}
      />
    </>
  );
}
