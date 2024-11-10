import { FoodProduct } from '#shared/models/food';
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

  const columns = [
    {
      title: 'Название',
      getValue: (p: FoodProduct, { createHref }: FoodProductTablesProps) => (
        <div>
          <Link to={createHref(p)}>{p.name}</Link>
          <small style={{ marginLeft: '10px' }}>{p.manufacturer}</small>
        </div>
      ),
    },
    {
      title: 'Калории',
      getValue: ({ nutrientsPerGram }: FoodProduct) => {
        return <div>{_.round(nutrientsPerGram.calories * 100, 2)} ккал</div>;
      },
    },
    {
      title: 'Белки',
      getValue: ({ nutrientsPerGram }: FoodProduct) => {
        return <div>{_.round(nutrientsPerGram.proteins * 100, 2)} г</div>;
      },
    },
    {
      title: 'Жиры',
      getValue: ({ nutrientsPerGram }: FoodProduct) => {
        return <div>{_.round(nutrientsPerGram.fats * 100, 2)} г</div>;
      },
    },
    {
      title: 'Углеводы',
      getValue: ({ nutrientsPerGram }: FoodProduct) => {
        return <div>{_.round(nutrientsPerGram.carbs * 100, 2)} г</div>;
      },
    },
    {
      title: 'Клетчатка',
      getValue: ({ nutrientsPerGram }: FoodProduct) => {
        return <div>{_.round(nutrientsPerGram.fibers * 100, 2)} г</div>;
      },
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
        {products.map(product => {
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
