import { useCreateCosmeticApplicationMutation } from '../store';
import {
  useListCosmeticProductsQuery,
  useListCosmeticRecipesQuery,
} from '#/client/store/cosmetic';
import { DateFormat } from '#/shared/models/date';
import { nonReachable } from '#/shared/utils';
import { ApplicationItemSelect } from '../components/ApplicationItemSelect';

export function CreatingActionContainer({
  date,
  dayPartId,
}: {
  date: DateFormat;
  dayPartId: string;
}) {
  const listCosmeticProductsQuery = useListCosmeticProductsQuery();
  const listCosmeticRecipesQuery = useListCosmeticRecipesQuery();

  const creatingMutation = useCreateCosmeticApplicationMutation();

  return (
    <ApplicationItemSelect
      products={listCosmeticProductsQuery.data || []}
      recipes={listCosmeticRecipesQuery.data || []}
      onItemSelect={values => {
        if (values.type === 'product') {
          creatingMutation.mutate({
            date,
            dayPartId,
            source: {
              type: 'product',
              productId: values.item.id,
            },
          });
        } else if (values.type === 'recipe') {
          creatingMutation.mutate({
            date,
            dayPartId,
            source: {
              type: 'recipe',
              recipeId: values.item.id,
            },
          });
        } else {
          nonReachable(values);
        }
      }}
    />
  );
}
