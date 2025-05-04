import { FoodProductForm } from '#/client/entities/food/products';
import { useFoodNavigation } from '#/client/pages/food';
import { Page } from '#/client/widgets/Page';

export default function FoodProductCreatingPage() {
  const navigation = useFoodNavigation();

  return (
    <Page>
      <Page.Header>
        <Page.Title>Создать продукт</Page.Title>
      </Page.Header>

      <Page.Content>
        <FoodProductForm type="create" onSuccess={navigation.toProducts} />
      </Page.Content>
    </Page>
  );
}
