import { Medicament } from '#/shared/models/medicament';
import { Select, SelectProps } from '#/client/components/Select';
import { ModelValueProps } from '#/client/types';

export interface MedicamentSelectProps
  extends ModelValueProps<string>,
    Omit<SelectProps, keyof ModelValueProps> {
  medicaments: Medicament[];
}

export function MedicamentSelect({ medicaments, ...props }: MedicamentSelectProps) {
  return (
    <Select {...props}>
      {medicaments.map(quantity => {
        return (
          <Select.Option key={quantity.id} value={quantity.id}>
            {quantity.name}
          </Select.Option>
        );
      })}
    </Select>
  );
}
