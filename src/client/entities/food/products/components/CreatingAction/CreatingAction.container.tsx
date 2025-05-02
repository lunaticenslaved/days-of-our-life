import { FOOD_NAVIGATION } from '#/client/pages/food';
import { Button } from '#/ui-lib/components/atoms/Button/Button';

export function CreatingActionContainer() {
  return (
    <Button
      view="outlined"
      component="router-link"
      to={FOOD_NAVIGATION.toProductCreate()}>
      Создать продукт
    </Button>
  );
}
