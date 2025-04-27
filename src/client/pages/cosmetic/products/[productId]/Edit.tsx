import {
  CosmeticProductForm,
  useGetCosmeticProductQuery,
  useUpdateCosmeticProductMutation,
} from '#/client/entities/cosmetic/products';
import { useCosmeticNavigation, useCosmeticPageParams } from '#/client/pages/cosmetic';
import { Page } from '#/client/widgets/Page';

export default function CosmeticProductEditPage() {
  const { productId = '' } = useCosmeticPageParams();

  const navigation = useCosmeticNavigation();

  const getCosmeticProductQuery = useGetCosmeticProductQuery(productId);

  const product = getCosmeticProductQuery.data;

  const updateCosmeticProductMutation = useUpdateCosmeticProductMutation(productId, {
    onMutate: () => {
      if (product) {
        navigation.toProductOverview({ productId: product?.id });
      }
    },
  });

  return (
    <Page>
      <Page.Header>
        <Page.Title>Редактировать косметический продукт</Page.Title>
      </Page.Header>

      <Page.Content>
        {product ? (
          <CosmeticProductForm
            cosmeticProduct={product}
            onSubmit={values => {
              updateCosmeticProductMutation.mutate({
                product,
                newData: values,
              });
            }}
          />
        ) : (
          <Page.Loading />
        )}
      </Page.Content>
    </Page>
  );
}
