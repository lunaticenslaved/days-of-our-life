import { CosmeticBenefitActions } from './CosmeticBenefitActions';
import { useListCosmeticBenefitsQuery } from '#/client/store';
import { CosmeticBenefitsList as CosmeticBenefitsListBase } from '../components/CosmeticBenefitsList';

export function CosmeticBenefitsList() {
  const listCosmeticBenefitsQuery = useListCosmeticBenefitsQuery();

  return (
    <CosmeticBenefitsListBase
      benefits={listCosmeticBenefitsQuery.data || []}
      renderActions={benefit => {
        return <CosmeticBenefitActions benefit={benefit} />;
      }}
    />
  );
}
