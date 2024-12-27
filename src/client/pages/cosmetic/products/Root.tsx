import { CosmeticProductActions, CosmeticProductsList } from '#/client/entities/cosmetic';
import { COSMETIC_NAVIGATION, useCosmeticNavigation } from '#/client/pages/cosmetic';
import {
  useDeleteCosmeticProductMutation,
  useListCosmeticProductsQuery,
} from '#/client/store';
import { Link } from 'react-router-dom';

export default function Page() {
  const listCosmeticProductsQuery = useListCosmeticProductsQuery();
  const deleteCosmeticProductMutation = useDeleteCosmeticProductMutation();

  const cosmeticNavigation = useCosmeticNavigation();

  if (!listCosmeticProductsQuery.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Косметические продукты</h3>
      <div>
        <Link to={COSMETIC_NAVIGATION.toProductCreate()}>Добавить</Link>
      </div>
      <CosmeticProductsList
        products={listCosmeticProductsQuery.data}
        getCosmeticProductHref={product =>
          COSMETIC_NAVIGATION.toProductOverview({ productId: product.id })
        }
        renderActions={product => {
          return (
            <CosmeticProductActions
              onEdit={() => {
                cosmeticNavigation.toProductEdit({ productId: product.id });
              }}
              onDelete={() => {
                deleteCosmeticProductMutation.mutate(product);
              }}
            />
          );
        }}
      />
    </div>
  );
}
