import { CosmeticProductActions } from '#/client/entities/cosmetic/products';
import { useCosmeticNavigation, useCosmeticPageParams } from '#/client/pages/cosmetic';
import { useGetCosmeticProductQuery } from '#/client/store';
import { Page } from '#/client/widgets/Page';

export default function CosmeticProductOverviewPage() {
  const { productId = '' } = useCosmeticPageParams();

  const navigation = useCosmeticNavigation();

  const getCosmeticProductQuery = useGetCosmeticProductQuery(productId);

  const product = getCosmeticProductQuery.data;

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Page
      title={product.name}
      actions={
        <CosmeticProductActions
          product={product}
          onDeleted={() => {
            navigation.toProducts();
          }}
        />
      }>
      <div>Имя - {getCosmeticProductQuery.data.name}</div>
      <div>Производитель - {getCosmeticProductQuery.data.manufacturer}</div>
    </Page>
  );
}
