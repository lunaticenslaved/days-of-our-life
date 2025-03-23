import { COSMETIC_NAVIGATION } from '#/client/pages/cosmetic';
import { Button } from '#/ui-lib/atoms/Button';

export function CreatingAction() {
  return (
    <Button
      view="outlined"
      component="router-link"
      to={COSMETIC_NAVIGATION.toRecipeCreate()}>
      Создать рецепт
    </Button>
  );
}
