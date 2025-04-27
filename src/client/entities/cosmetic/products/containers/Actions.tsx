import { useDeleteCosmeticProductMutation } from '#/client/entities/cosmetic/products';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import { CosmeticProduct } from '#/shared/models/cosmetic';
import { ActionsComponent } from '../components/Actions';

type ActionsContainerProps = {
  product: CosmeticProduct;
  onDeleted: () => void;
};

export function ActionsContainer({ product, onDeleted }: ActionsContainerProps) {
  const cosmeticNavigation = useCosmeticNavigation();

  const deleteCosmeticProductMutation = useDeleteCosmeticProductMutation({
    onSuccess: onDeleted,
  });

  return (
    <ActionsComponent
      entity={product}
      onDelete={() => {
        deleteCosmeticProductMutation.mutate(product);
      }}
      onEdit={() => {
        cosmeticNavigation.toProductEdit({ productId: product.id });
      }}
      loading={{
        edit: false,
        delete: deleteCosmeticProductMutation.isPending,
      }}
      disabled={{
        edit: false,
        delete: deleteCosmeticProductMutation.isPending,
      }}
    />
  );
}
