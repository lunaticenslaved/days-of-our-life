import { Medicament } from '#/shared/models/medicament';
import { ReactNode } from 'react';

interface MedicamentsListProps {
  medicaments: Medicament[];
  renderActions?: (medicament: Medicament) => ReactNode;
}

export function MedicamentsList({ medicaments, renderActions }: MedicamentsListProps) {
  return (
    <ul>
      {medicaments.map(medicament => {
        return (
          <li key={medicament.id} style={{ display: 'flex' }}>
            <div style={{ flexGrow: 1 }}>{medicament.name}</div>
            {!!renderActions && <div>{renderActions(medicament)}</div>}
          </li>
        );
      })}
    </ul>
  );
}
