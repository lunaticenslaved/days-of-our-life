import { Button } from '#/client/components/Button';
import { CosmeticRecipesList } from '#/client/entities/cosmetic';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';

export default function Page() {
  const navigation = useCosmeticNavigation();

  return (
    <>
      <Button onClick={() => navigation.toRecipeCreate()}>Создать рецепт</Button>

      <CosmeticRecipesList />
    </>
  );
}
