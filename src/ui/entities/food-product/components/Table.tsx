import { FoodProduct } from '#shared/models/FoodProduct';
import { Link } from 'react-router-dom';

interface FoodProductTablesProps {
  products: FoodProduct[];
  createHref(product: FoodProduct): string;
}

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
    getValue: ({ nutrients }: FoodProduct) => <div>{nutrients.calories} ккал</div>,
  },
  {
    title: 'Белки',
    getValue: ({ nutrients }: FoodProduct) => <div>{nutrients.proteins} г</div>,
  },
  {
    title: 'Жиры',
    getValue: ({ nutrients }: FoodProduct) => <div>{nutrients.fats} г</div>,
  },
  {
    title: 'Углеводы',
    getValue: ({ nutrients }: FoodProduct) => <div>{nutrients.carbs} г</div>,
  },
];

export function FoodProductsTable(props: FoodProductTablesProps) {
  const { products } = props;

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
