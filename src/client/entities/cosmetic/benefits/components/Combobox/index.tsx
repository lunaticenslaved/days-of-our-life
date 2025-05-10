import { ComponentProps } from 'react';
import { CompoboxComponent } from './Combobox.component';
import { useListCosmeticBenefitsQuery } from '#/client/entities/cosmetic/benefits/queries';

export { CompoboxComponent as CosmeticBenefitsCombobox };

type CompoboxComponentProps = ComponentProps<typeof CompoboxComponent>;

export function useCosmeticBenefitsComboboxContainer(): Pick<
  CompoboxComponentProps,
  'isFetchingBenefits' | 'benefits'
> {
  const query = useListCosmeticBenefitsQuery();

  return {
    isFetchingBenefits: query.isFetching,
    benefits: query.data || [],
  };
}
