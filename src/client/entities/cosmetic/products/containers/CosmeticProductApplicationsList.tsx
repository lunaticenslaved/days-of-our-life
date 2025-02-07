import { Button } from '#/client/components/Button';
import { CosmeticProductsList } from '#/client/entities/cosmetic';
import { COSMETIC_NAVIGATION } from '#/client/pages/cosmetic';
import {
  useListCosmeticProductsQuery,
  useListDayPartsQuery,
  useRemoveCosmeticProductFromDateMutation,
} from '#/client/store';
import { CosmeticProduct, CosmeticProductApplication } from '#/shared/models/cosmetic';
import { DayPart } from '#/shared/models/day';
import { useMemo } from 'react';

interface CosmeticProductApplicationsListProps {
  applications: CosmeticProductApplication[];
}

export function CosmeticProductApplicationsList({
  applications,
}: CosmeticProductApplicationsListProps) {
  const listDayPartsQuery = useListDayPartsQuery();
  const listCosmeticProductsQuery = useListCosmeticProductsQuery();
  const removeCosmeticProductFromDateMutation =
    useRemoveCosmeticProductFromDateMutation();

  const data = useMemo(() => {
    const results: Record<
      string,
      {
        dayPart: DayPart;
        application: CosmeticProductApplication;
        cosmeticProduct: CosmeticProduct;
      }
    > = {};

    if (!listCosmeticProductsQuery.data || !listDayPartsQuery.data) {
      return results;
    }

    for (const application of applications) {
      const cosmeticProduct = listCosmeticProductsQuery.data.find(
        p => p.id === application.cosmeticProductId,
      );

      if (!cosmeticProduct) {
        throw new Error('Cosmetic product not found');
      }

      const dayPart = listDayPartsQuery.data.find(d => d.id === application.dayPartId);

      if (!dayPart) {
        throw new Error('Day part not found');
      }

      results[cosmeticProduct.id] = {
        dayPart,
        application,
        cosmeticProduct,
      };
    }

    return results;
  }, [applications, listCosmeticProductsQuery.data, listDayPartsQuery.data]);

  if (!listDayPartsQuery.data || !listCosmeticProductsQuery.data) {
    return <div>Loading...</div>;
  }

  return (
    <CosmeticProductsList
      products={Object.values(data).map(item => item.cosmeticProduct)}
      getCosmeticProductHref={product => {
        return COSMETIC_NAVIGATION.toProductOverview({ productId: product.id });
      }}
      renderActions={product => {
        const { application } = data[product.id];

        return (
          <Button
            onClick={() => {
              removeCosmeticProductFromDateMutation.mutate(application);
            }}>
            Удалить
          </Button>
        );
      }}
    />
  );
}
