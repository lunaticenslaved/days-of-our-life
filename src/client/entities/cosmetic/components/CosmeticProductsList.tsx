import { CosmeticProduct } from '#/shared/models/cosmetic';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CosmeticProductsListProps {
  products: CosmeticProduct[];
  renderActions?(product: CosmeticProduct): ReactNode;
  renderTextAppend?(product: CosmeticProduct): ReactNode;
  getCosmeticProductHref(product: CosmeticProduct): string;
}

export function CosmeticProductsList({
  products,
  renderActions,
  renderTextAppend,
  getCosmeticProductHref,
}: CosmeticProductsListProps) {
  return (
    <ul>
      {products.map(product => {
        return (
          <li key={product.id} style={{ display: 'flex' }}>
            <div>
              <Link to={getCosmeticProductHref(product)}>{product.name}</Link>
              <div>
                <small>{product.manufacturer}</small>
              </div>
              {renderTextAppend && <div>{renderTextAppend(product)}</div>}
            </div>
            {!!renderActions && <div>{renderActions(product)}</div>}
          </li>
        );
      })}
    </ul>
  );
}
