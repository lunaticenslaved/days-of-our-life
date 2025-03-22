import { CosmeticProductForm } from '#/client/entities/cosmetic/products';
import { useCosmeticNavigation, useCosmeticPageParams } from '#/client/pages/cosmetic';
import {
  useGetCosmeticProductQuery,
  useUpdateCosmeticProductMutation,
} from '#/client/store';

export default function Page() {
  const { productId = '' } = useCosmeticPageParams();

  const navigation = useCosmeticNavigation();

  const getCosmeticProductQuery = useGetCosmeticProductQuery(productId);

  const product = getCosmeticProductQuery.data;

  const updateCosmeticProductMutation = useUpdateCosmeticProductMutation({
    onMutate: () => {
      if (product) {
        navigation.toProductOverview({ productId: product?.id });
      }
    },
  });

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Edit cosmetic product</h3>
      <CosmeticProductForm
        cosmeticProduct={product}
        onSubmit={values => {
          updateCosmeticProductMutation.mutate({
            product,
            newData: values,
          });
        }}
      />
    </div>
  );
}
