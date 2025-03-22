import { CosmeticProductActions } from '#/client/entities/cosmetic/products';
import { useCosmeticNavigation, useCosmeticPageParams } from '#/client/pages/cosmetic';
import { useGetCosmeticProductQuery } from '#/client/store';

export default function Page() {
  const { productId = '' } = useCosmeticPageParams();

  const navigation = useCosmeticNavigation();

  const getCosmeticProductQuery = useGetCosmeticProductQuery(productId);

  const product = getCosmeticProductQuery.data;

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CosmeticProductActions
        product={product}
        onDeleted={() => {
          navigation.toProducts();
        }}
      />

      <div>Имя - {getCosmeticProductQuery.data.name}</div>
      <div>Производитель - {getCosmeticProductQuery.data.manufacturer}</div>
    </div>
  );
}
