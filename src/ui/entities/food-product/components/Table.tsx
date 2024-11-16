import { FoodProduct, multiplyNutrients, roundNutrients } from '#shared/models/food';
import { Button } from '#ui/components/Button';
import _ from 'lodash';
import { Link } from 'react-router-dom';

interface FoodProductTablesProps {
  products: FoodProduct[];
  createHref(product: FoodProduct): string;
  onDelete(product: FoodProduct): void;
}

export function FoodProductsTable(props: FoodProductTablesProps) {
  const { products, onDelete } = props;

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
          <Link to={createHref(p)}>{p.name}</Link>
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
        return <Button onClick={onDelete.bind(null, product)}>Удалить</Button>;
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
