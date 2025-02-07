import { useListDayPartsQuery } from '#/client/entities/day-parts';
import { FoodMealItemCreatingAction } from '#/client/entities/food';
import {
  useListFoodMealItemQuery,
  useListFoodProductsQuery,
  useListFoodRecipesQuery,
} from '#/client/store/food';
import { DateFormat } from '#/shared/models/date';
import { ListComponent } from '../components/List';
import { ActionsContainer } from './Actions';

interface ListContainerProps {
  date: DateFormat;
}

export function ListContainer({ date }: ListContainerProps) {
  const listProducts = useListFoodProductsQuery();
  const listRecipes = useListFoodRecipesQuery();
  const listMealItems = useListFoodMealItemQuery(date);
  const listDayParts = useListDayPartsQuery();

  const dayParts = listDayParts.data || [];
  const products = listProducts.data || [];
  const recipes = listRecipes.data || [];
  const mealItems = listMealItems.data || [];

  return (
    <ul>
      {dayParts.map(dayPart => {
        const mealItemsForDayPart = mealItems.filter(
          mealItem => mealItem.dayPartId === dayPart.id,
        );

        return (
          <li key={dayPart.id}>
            <section>
              <h6>
                <div>{dayPart.name}</div>
                <FoodMealItemCreatingAction date={date} dayPartId={dayPart.id} />
              </h6>

              <ListComponent
                recipes={recipes}
                products={products}
                entities={mealItemsForDayPart}
                renderActions={mealItem => {
                  return <ActionsContainer entity={mealItem} />;
                }}
              />
            </section>
          </li>
        );
      })}
    </ul>
  );
}
