import { ComponentProps } from 'react';
import { ListComponent as CosmeticBenefitsList } from './List.component';

import { CosmeticBenefitActions, useCosmeticBenefitActionsContainer } from '../Actions';

import { useListCosmeticBenefitsQuery } from '../../queries';
import { CosmeticBenefit } from '#/shared/models/cosmetic';

export { CosmeticBenefitsList };

type CosmeticBenefitsListProps = ComponentProps<typeof CosmeticBenefitsList>;

export function useCosmeticBenefitsListContainer(props: {
  withActions: boolean;
}): Pick<CosmeticBenefitsListProps, 'benefits' | 'renderActions' | 'isFetchingBenefits'> {
  const query = useListCosmeticBenefitsQuery();

  return {
    benefits: query.data || [],
    isFetchingBenefits: query.isFetching,
    renderActions: props.withActions ? benefit => <Actions {...benefit} /> : undefined,
  };
}

function Actions(benefit: CosmeticBenefit) {
  const container = useCosmeticBenefitActionsContainer(benefit.id);

  return <CosmeticBenefitActions entity={benefit} {...container} />;
}
