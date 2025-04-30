import { COSMETIC_NAVIGATION } from '#/client/pages/cosmetic';
import { Button } from '#/ui-lib/components/atoms/Button/Button';

export function CreatingActionContainer() {
  return (
    <Button component="router-link" to={COSMETIC_NAVIGATION.toProductCreate()}>
      Создать продукт
    </Button>
  );
}
