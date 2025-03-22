import { CosmeticProductForm } from '#/client/entities/cosmetic/products';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import { useCreateCosmeticProductMutation } from '#/client/store';

export default function Page() {
  const createCosmeticProductMutation = useCreateCosmeticProductMutation();
  const navigation = useCosmeticNavigation();

  return (
    <div style={{ maxWidth: '550px' }}>
      <CosmeticProductForm
        onSubmit={values => {
          createCosmeticProductMutation.mutate(values, {
            onSuccess: response => {
              navigation.toProductOverview({ productId: response.id });
            },
          });
        }}
      />
    </div>
  );
}
