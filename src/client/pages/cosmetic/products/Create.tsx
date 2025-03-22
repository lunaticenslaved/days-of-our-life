import { CosmeticProductForm } from '#/client/entities/cosmetic/products';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import { useCreateCosmeticProductMutation } from '#/client/store';
import { Page } from '#/client/widgets/Page';

export default function CreateCosmeticProductPage() {
  const createCosmeticProductMutation = useCreateCosmeticProductMutation();
  const navigation = useCosmeticNavigation();

  return (
    <Page title="Новый косметический продукт">
      <CosmeticProductForm
        onSubmit={values => {
          createCosmeticProductMutation.mutate(values, {
            onSuccess: response => {
              navigation.toProductOverview({ productId: response.id });
            },
          });
        }}
      />
    </Page>
  );
}
