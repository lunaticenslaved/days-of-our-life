import { useCreateCosmeticApplicationMutation } from '../store';
import { DateFormat } from '#/shared/models/date';
import { nonReachable } from '#/shared/utils';
import { ApplicationItemSelect } from '../components/ApplicationItemSelect';
import { useListCosmeticProductsQuery } from '#/client/entities/cosmetic/products';
import { useListCosmeticRecipesQuery } from '#/client/entities/cosmetic/recipes';

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
              productId: values.productId,
            },
          });
        } else if (values.type === 'recipe') {
          creatingMutation.mutate({
            date,
            dayPartId,
            source: {
              type: 'recipe',
              recipeId: values.recipeId,
            },
          });
        } else {
          nonReachable(values);
        }
      }}
    />
  );
}
