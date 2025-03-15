import { multiplyNutrients } from '#/shared/models/food';
import { FoodNutrientsList, FoodProductActions } from '#/client/entities/food';
import { useFoodPageParams } from '#/client/pages/food';
import { useGetFoodProductQuery } from '#/client/store';
import { Page as PageWidget } from '#/client/widgets/Page';
import { Box } from '#/ui-lib/atoms/Box';

export default function Page() {
  const { productId = '' } = useFoodPageParams();
  const query = useGetFoodProductQuery({ id: productId });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (!query.data) {
    throw new Error('Unknown product');
  }

  const product = query.data;
  const nutrients = multiplyNutrients(product.nutrientsPerGram, 100);

  return (
    <PageWidget
      title={product.name}
      actions={
        <Box>
          <FoodProductActions entity={product} />
        </Box>
      }>
      {product.manufacturer && <h2>{product.manufacturer}</h2>}
      <FoodNutrientsList nutrients={nutrients} />
    </PageWidget>
  );
}
