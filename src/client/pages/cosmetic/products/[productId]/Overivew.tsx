import { CosmeticProductActions } from '#/client/entities/cosmetic';
import { useCosmeticNavigation, useCosmeticPageParams } from '#/client/pages/cosmetic';
import {
  useDeleteCosmeticProductMutation,
  useGetCosmeticProductQuery,
} from '#/client/store';

export default function Page() {
  const { productId = '' } = useCosmeticPageParams();

  const navigation = useCosmeticNavigation();

  const getCosmeticProductQuery = useGetCosmeticProductQuery(productId);
  const deleteCosmeticProductMutation = useDeleteCosmeticProductMutation();

  const product = getCosmeticProductQuery.data;

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CosmeticProductActions
        onEdit={() => navigation.toProductEdit({ productId: product.id })}
        onDelete={() => {
          deleteCosmeticProductMutation.mutate(product);
          navigation.toProducts();
        }}
      />

      <div>Имя - {getCosmeticProductQuery.data.name}</div>
      <div>Производитель - {getCosmeticProductQuery.data.manufacturer}</div>
    </div>
  );
}
