import { Button } from '#/ui-lib/components/atoms/Button/Button';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';

export function CreatingAction() {
  const navigation = useCosmeticNavigation();

  return <Button onClick={navigation.toIngredientCreate}>Добавить ингредиент</Button>;
}
