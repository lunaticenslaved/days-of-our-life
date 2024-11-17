import { FoodProduct } from '#shared/models/food';
import { Select, SelectProps } from '#ui/components/Select';

interface FoodProductSelectProps extends SelectProps {
  products: FoodProduct[];
}

export function FoodProductSelect({ products, ...props }: FoodProductSelectProps) {
  return (
    <Select {...props}>
      {products.map(product => {
        return (
          <Select.Option key={product.id} value={product.id}>
            {product.name}
          </Select.Option>
        );
      })}
    </Select>
  );
}
