import { COSMETIC_NAVIGATION } from '#/client/pages/cosmetic';
import { Button } from '#/ui-lib/atoms/Button';

export function CreatingActionContainer() {
  return (
    <Button component="router-link" to={COSMETIC_NAVIGATION.toINCIIngredientCreate()}>
      Добавить ингредиент
    </Button>
  );
}
