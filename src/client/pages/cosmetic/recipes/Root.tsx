import { Button } from '#/ui-lib/atoms/Button';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import { Page } from '#/client/widgets/Page';
import { CosmeticRecipesList } from '#/client/entities/cosmetic/recipes';

export default function CosmeticRecipesPage() {
  const navigation = useCosmeticNavigation();

  return (
    <Page
      title="Косметические рецепты"
      actions={
        <Button view="outlined" onClick={() => navigation.toRecipeCreate()}>
          Создать рецепт
        </Button>
      }>
      <CosmeticRecipesList />
    </Page>
  );
}
