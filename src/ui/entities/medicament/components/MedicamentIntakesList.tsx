import { Medicament, MedicamentIntake } from '#/shared/models/medicament';
import { Fragment, ReactNode } from 'react';

interface MedicamentIntakesListProps {
  intakes: MedicamentIntake[];
  medicaments: Medicament[];
  renderActions?: (intake: MedicamentIntake) => ReactNode;
}

export function MedicamentIntakesList({
  intakes,
  medicaments,
  renderActions,
}: MedicamentIntakesListProps) {
  return (
    <ul style={{ margin: 0, padding: 0 }}>
      {intakes.map(intake => {
        const medicament = medicaments.find(m => m.id === intake.medicamentId);

        if (!medicament) {
          return <Fragment key={intake.id} />;
        }

        return (
          <li key={medicament.id} style={{ display: 'flex' }}>
            <div style={{ flexGrow: 1 }}>{medicament.name}</div>
            {!!renderActions && <div>{renderActions(intake)}</div>}
          </li>
        );
      })}
    </ul>
  );
}
