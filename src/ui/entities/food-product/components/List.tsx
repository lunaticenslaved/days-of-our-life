import { FoodProduct } from '#shared/models/FoodProduct';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface FoodProductListProps {
  products: FoodProduct[];
  createHref?(product: FoodProduct): string;
}

export function FoodProductList({ products, createHref }: FoodProductListProps) {
  return (
    <ul>
      {products.map(product => {
        const href = createHref?.(product);

        let content: ReactNode = null;

        if (href) {
          content = <Link to={href}>{product.name}</Link>;
        } else {
          content = product.name;
        }

        return <li key={product.id}>{content}</li>;
      })}
    </ul>
  );
}
