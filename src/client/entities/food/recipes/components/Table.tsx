import { FoodRecipe, multiplyNutrients, roundNutrients } from '#/shared/models/food';
import { Button } from '#/ui-lib/components/atoms/Button/Button';
import _ from 'lodash';

interface FoodRecipesTableProps {
  recipes: FoodRecipe[];
  to: (recipe: FoodRecipe) => string;
}

export function FoodRecipesTable(props: FoodRecipesTableProps) {
  const { recipes } = props;

  const preparedRecipes = recipes.map(recipe => {
    return {
      ...recipe,
      nutrients: roundNutrients(multiplyNutrients(recipe.nutrientsPerGram, 100)),
    };
  });

  type Item = (typeof preparedRecipes)[number];

  const columns = [
    {
      title: 'Название',
      getValue: (p: Item, { to }: FoodRecipesTableProps) => (
        <div>
          <Button component="router-link" color="secondary" view="clear" to={to(p)}>
            {p.name}
          </Button>
        </div>
      ),
    },
    {
      title: 'Калории',
      getValue: ({ nutrients }: Item) => nutrients.calories,
    },
    {
      title: 'Белки',
      getValue: ({ nutrients }: Item) => nutrients.proteins,
    },
    {
      title: 'Жиры',
      getValue: ({ nutrients }: Item) => nutrients.fats,
    },
    {
      title: 'Углеводы',
      getValue: ({ nutrients }: Item) => nutrients.carbs,
    },
    {
      title: 'Клетчатка',
      getValue: ({ nutrients }: Item) => nutrients.fibers,
    },
  ];

  return (
    <table>
      <thead>
        <tr>
          {columns.map(({ title }, index) => (
            <th key={index}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {preparedRecipes.map(product => {
          return (
            <tr key={product.id}>
              {columns.map(({ getValue }, index) => (
                <td key={index} style={{ padding: '0 10px' }}>
                  {getValue(product, props)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
