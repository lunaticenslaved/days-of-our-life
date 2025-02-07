import { getNutrientsPerGram } from '#/client/entities/food/meal-items/utils';
import {
  useCreateFoodMealItem,
  useUpdateFoodMealItem,
  useListFoodProductsQuery,
  useListFoodRecipesQuery,
} from '#/client/store/food';
import { DateFormat } from '#/shared/models/date';
import { FoodMealItem } from '#/shared/models/food';
import { assertDefined, nonReachable } from '#/shared/utils';
import {
  FoodMealItemFormDialog as FormDialogComponent,
  FoodMealItemFormDialogProps as FormDialogComponentProps,
} from '../components/FormDialog';

interface CommonProps extends Pick<FormDialogComponentProps, 'dialog'> {}

interface CreatingDialogProps extends CommonProps {
  type: 'create';
  date: DateFormat;
  dayPartId: string;
  onCreated: () => void;
}

interface UpdatingDialogProps extends CommonProps {
  type: 'update';
  mealItem: FoodMealItem;
  onUpdated: () => void;
}

type FormDialogContainerProps = CreatingDialogProps | UpdatingDialogProps;

export function FormDialogContainer(props: FormDialogContainerProps) {
  if (props.type === 'create') {
    return <CreatingDialog {...props} />;
  } else if (props.type === 'update') {
    return <UpdatingDialog {...props} />;
  }

  nonReachable(props);
}

function CreatingDialog({
  type: _type,
  onCreated,
  date,
  dayPartId,
  ...otherProps
}: CreatingDialogProps) {
  const listProducts = useListFoodProductsQuery();
  const listRecipes = useListFoodRecipesQuery();

  const products = listProducts.data || [];
  const recipes = listRecipes.data || [];

  const createMealItem = useCreateFoodMealItem({
    onMutate: onCreated,
  });

  return (
    <FormDialogComponent
      {...otherProps}
      isPending={createMealItem.isPending}
      onSubmit={values => {
        const nutrients = getNutrientsPerGram(values, { products, recipes });

        assertDefined(nutrients);

        createMealItem.mutate({
          date,
          dayPartId,
          quantity: {
            value: values.quantity,
            converterId: values.quantityConverterId,
          },
          nutrients: nutrients,
          food: values.food,
        });
      }}
      products={products}
      recipes={recipes}
    />
  );
}

function UpdatingDialog({
  type: _type,
  onUpdated,
  mealItem,
  ...otherProps
}: UpdatingDialogProps) {
  const listProducts = useListFoodProductsQuery();
  const listRecipes = useListFoodRecipesQuery();

  const products = listProducts.data || [];
  const recipes = listRecipes.data || [];

  const updateMealItem = useUpdateFoodMealItem({
    onMutate: onUpdated,
  });

  return (
    <FormDialogComponent
      {...otherProps}
      isPending={updateMealItem.isPending}
      entity={mealItem}
      onSubmit={values => {
        const nutrients = getNutrientsPerGram(values, { products, recipes });

        assertDefined(nutrients);

        updateMealItem.mutate({
          oldItem: mealItem,
          newValues: {
            date: mealItem.date,
            dayPartId: mealItem.dayPartId,
            quantity: {
              value: values.quantity,
              converterId: values.quantityConverterId,
            },
            nutrients: nutrients,
            food: values.food,
          },
        });
      }}
      products={products}
      recipes={recipes}
    />
  );
}
