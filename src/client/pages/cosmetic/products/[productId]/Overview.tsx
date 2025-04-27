import {
  CosmeticProductActions,
  useGetCosmeticProductQuery,
} from '#/client/entities/cosmetic/products';
import { useCosmeticNavigation, useCosmeticPageParams } from '#/client/pages/cosmetic';
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
    <Page>
      <Page.Header>
        <Page.Title>{product.name}</Page.Title>
        <Page.Actions>
          <CosmeticProductActions
            product={product}
            onDeleted={() => {
              navigation.toProducts();
            }}
          />
        </Page.Actions>
      </Page.Header>

      <Page.Content>
        {product ? (
          <>
            <div>Имя - {getCosmeticProductQuery.data.name}</div>
            <div>Производитель - {getCosmeticProductQuery.data.manufacturer}</div>
          </>
        ) : (
          <Page.Loading />
        )}
      </Page.Content>
    </Page>
  );
}
