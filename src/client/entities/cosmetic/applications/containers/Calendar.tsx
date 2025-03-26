import { useListCosmeticApplicationsQuery } from '#/client/entities/cosmetic/applications/store';
import {
  useListCosmeticProductsQuery,
  useListCosmeticRecipesQuery,
  useListDayPartsQuery,
} from '#/client/store';
import { DateUtils } from '#/shared/models/date';
import { useMemo } from 'react';
import { CalendarComponent } from '../components/Calendar';
import { ListComponent } from '../components/List';
import { CosmeticProduct, CosmeticRecipe } from '#/shared/models/cosmetic';

import { CreatingActionContainer } from './CreatingAction';
import { ActionsContainer } from './Actions';

const startDate = DateUtils.toDateFormat(DateUtils.now().subtract(30, 'days'));
const endDate = DateUtils.toDateFormat(DateUtils.now().add(30, 'days'));

export function CalendarContainer() {
  const dayPartsQuery = useListDayPartsQuery();
  const applicationsQuery = useListCosmeticApplicationsQuery({ startDate, endDate });

  const productsQuery = useListCosmeticProductsQuery();
  const recipesQuery = useListCosmeticRecipesQuery();

  const productsMap = useMemo(() => {
    return (productsQuery.data || []).reduce(
      (acc, product) => {
        return {
          ...acc,
          [product.id]: product,
        };
      },
      {} as Record<string, CosmeticProduct>,
    );
  }, [productsQuery.data]);

  const recipesMap = useMemo(() => {
    return (recipesQuery.data || []).reduce(
      (acc, recipe) => {
        return {
          ...acc,
          [recipe.id]: recipe,
        };
      },
      {} as Record<string, CosmeticRecipe>,
    );
  }, [recipesQuery.data]);

  return (
    <CalendarComponent
      startDate={startDate}
      endDate={endDate}
      dayParts={dayPartsQuery.data || []}
      applications={applicationsQuery.data || []}
      renderApplications={data => {
        return (
          <>
            <CreatingActionContainer date={data.date} dayPartId={data.dayPartId} />
            <ListComponent
              entities={data.applications}
              productsMap={productsMap}
              recipesMap={recipesMap}
              renderActions={application => {
                return (
                  <ActionsContainer application={application} onDeleted={() => null} />
                );
              }}
            />
          </>
        );
      }}
    />
  );
}
