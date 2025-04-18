import {
  useCreateCosmeticApplicationMutation,
  useListCosmeticApplicationsQuery,
} from '../store';
import {
  useListCosmeticProductsQuery,
  useListCosmeticRecipesQuery,
  useListDayPartsQuery,
} from '#/client/store';
import { DateUtils } from '#/shared/models/date';
import { useMemo, useState } from 'react';
import { CalendarComponent } from '../components/Calendar';
import { ListComponent } from '../components/List';
import { CosmeticProduct, CosmeticRecipe } from '#/shared/models/cosmetic';

import { CreatingActionContainer } from './CreatingAction';
import { ActionsContainer } from './Actions';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Button } from '#/ui-lib/atoms/Button';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';

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

  const [clipboard, setClipboard] = useState<CosmeticApplication[]>();
  const creatingMutation = useCreateCosmeticApplicationMutation();

  return (
    <CalendarComponent
      startDate={startDate}
      endDate={endDate}
      dayParts={dayPartsQuery.data || []}
      applications={applicationsQuery.data || []}
      renderApplications={data => {
        return (
          <>
            <Flex gap={1}>
              <CreatingActionContainer date={data.date} dayPartId={data.dayPartId} />
              {data.applications.length > 0 && (
                <Button
                  view="toned"
                  onClick={() => {
                    setClipboard(data.applications);
                  }}>
                  Копировать
                </Button>
              )}
              {!!clipboard?.length && (
                <Button
                  view="toned"
                  onClick={async () => {
                    for (const application of clipboard) {
                      await creatingMutation.mutateAsync({
                        date: data.date,
                        dayPartId: data.dayPartId,
                        source: application.source,
                      });
                    }
                  }}>
                  Вставить
                </Button>
              )}
            </Flex>
            <ListComponent
              hideSearch
              applications={data.applications}
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
