import { FoodProduct, multiplyNutrients, roundNutrients } from '#/shared/models/food';
import { Button } from '#/ui-lib/atoms/Button';
import _ from 'lodash';
import { ReactNode } from 'react';

interface FoodProductTablesProps {
  products: FoodProduct[];
  createHref(product: FoodProduct): string;
  renderActions: (product: FoodProduct) => ReactNode;
}

export function FoodProductsTable(props: FoodProductTablesProps) {
  const { products, renderActions } = props;

  const preparedProducts = products.map(product => {
    return {
      ...product,
      nutrients: roundNutrients(multiplyNutrients(product.nutrientsPerGram, 100)),
    };
  });

  type Item = (typeof preparedProducts)[number];

  const columns = [
    {
      title: 'Название',
      getValue: (p: Item, { createHref }: FoodProductTablesProps) => (
        <div>
          <Button
            component="router-link"
            color="secondary"
            view="clear"
            to={createHref(p)}>
            {p.name}
          </Button>
          <small style={{ marginLeft: '10px' }}>{p.manufacturer}</small>
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
    {
      title: '',
      getValue: (product: FoodProduct) => {
        return <>{renderActions(product)}</>;
      },
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
        {preparedProducts.map(product => {
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
