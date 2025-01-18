import {
  CosmeticIngredientActions,
  CosmeticIngredientsList,
  CreateCosmeticIngredientAction,
} from '#/client/entities/cosmetic';

export default function Page() {
  return (
    <>
      <CreateCosmeticIngredientAction />

      <CosmeticIngredientsList
        renderAction={ingredient => {
          return <CosmeticIngredientActions ingredient={ingredient} />;
        }}
      />
    </>
  );
}
