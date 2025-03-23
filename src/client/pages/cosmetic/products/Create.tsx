import { CosmeticProductForm } from '#/client/entities/cosmetic/products';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import { useCreateCosmeticProductMutation } from '#/client/store';
import { Page } from '#/client/widgets/Page';

export default function CreateCosmeticProductPage() {
  const createCosmeticProductMutation = useCreateCosmeticProductMutation();
  const navigation = useCosmeticNavigation();

  return (
    <Page>
      <Page.Header>
        <Page.Title>Новый косметический продукт</Page.Title>
      </Page.Header>

      <Page.Content>
        <CosmeticProductForm
          onSubmit={values => {
            createCosmeticProductMutation.mutate(values, {
              onSuccess: response => {
                navigation.toProductOverview({ productId: response.id });
              },
            });
          }}
        />
      </Page.Content>
    </Page>
  );
}
