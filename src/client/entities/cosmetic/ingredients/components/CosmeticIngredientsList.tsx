import { useListCosmeticIngredientsQuery } from '#/client/store';
import { CosmeticIngredient } from '#/shared/models/cosmetic';
import { ReactNode } from 'react';

interface CosmeticIngredientsListProps {
  renderAction?(ingredient: CosmeticIngredient): ReactNode;
}

export function CosmeticIngredientsList({ renderAction }: CosmeticIngredientsListProps) {
  const listCosmeticIngredientQuery = useListCosmeticIngredientsQuery();

  return (
    <ul>
      {(listCosmeticIngredientQuery.data || []).map(ingredient => {
        return (
          <li key={ingredient.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexGrow: 1 }}>{ingredient.name}</div>
            <div>{!!renderAction && renderAction(ingredient)}</div>
          </li>
        );
      })}
    </ul>
  );
}
