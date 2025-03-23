import { FoodProductForm } from '#/client/entities/food';
import { useFoodNavigation, useFoodPageParams } from '#/client/pages/food';
import { useGetFoodProductQuery } from '#/client/store';
import { Page } from '#/client/widgets/Page';

export default function FoodProductUpdatingPage() {
  const { productId = '' } = useFoodPageParams();
  const query = useGetFoodProductQuery({ id: productId });
  const navigation = useFoodNavigation();

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (!query.data) {
    // TODO add error boundary to page
    throw new Error('Unknown product');
  }

  const product = query.data;

  return (
    <Page>
      <Page.Header>
        <Page.Title>Редактировать продукт</Page.Title>
      </Page.Header>

      <Page.Content>
        <FoodProductForm
          type="update"
          product={product}
          onSuccess={({ id: productId }) => {
            navigation.toProductOverview({ productId });
          }}
        />
      </Page.Content>
    </Page>
  );
}
