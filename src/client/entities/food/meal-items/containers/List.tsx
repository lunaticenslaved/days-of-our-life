import { useListDayPartsQuery } from '#/client/entities/day-parts';
import { FoodMealItemCreatingAction, FoodNutrientsList } from '#/client/entities/food';
import {
  useListFoodMealItemQuery,
  useListFoodProductsQuery,
  useListFoodRecipesQuery,
} from '#/client/store/food';
import { DateFormat } from '#/shared/models/date';
import { sumNutrients } from '#/shared/models/food';
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
              <h4>
                <span>{dayPart.name}</span>
                <FoodMealItemCreatingAction date={date} dayPartId={dayPart.id} />
              </h4>

              <FoodNutrientsList
                nutrients={sumNutrients(mealItemsForDayPart.map(item => item.nutrients))}
              />

              <h5>Продукты</h5>

              <ListComponent
                recipes={recipes}
                products={products}
                entities={mealItemsForDayPart}
                renderActions={mealItem => {
                  return <ActionsContainer entity={mealItem} />;
                }}
              />
            </section>

            <hr></hr>
          </li>
        );
      })}
    </ul>
  );
}
