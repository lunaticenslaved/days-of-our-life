import {
  CosmeticBenefit,
  CosmeticBenefitTree,
  CosmeticUtils,
} from '#/shared/models/cosmetic';
import { Select, SelectMultipleProps, SelectSingleProps } from '#/ui-lib/atoms/Select';
import { useMemo } from 'react';
import { useListCosmeticBenefitsQuery } from '#/client/store';

function Options({
  benefits,
  hiddenIds,
}: {
  benefits: CosmeticBenefit[];
  hiddenIds?: string[];
}) {
  const tree = useMemo(() => {
    return CosmeticUtils.treeBenefits(benefits);
  }, [benefits]);

  return (
    <>
      {tree.map(benefit => {
        return (
          <BenefitOption
            key={benefit.id}
            benefit={benefit}
            level={0}
            hiddenIds={hiddenIds}
          />
        );
      })}
    </>
  );
}

function BenefitOption({
  benefit,
  level,
  hiddenIds,
}: {
  benefit: CosmeticBenefitTree;
  level: number;
  hiddenIds?: string[];
}) {
  if (hiddenIds?.includes(benefit.id)) {
    return null;
  }

  return (
    <>
      <Select.Option value={benefit.id}>
        {''.padStart(level, '-')} {benefit.name}
      </Select.Option>
      {benefit.children.length > 0 && (
        <>
          {CosmeticUtils.orderBenefits(benefit.children).map(child => {
            return (
              <BenefitOption
                key={child.id}
                benefit={child}
                level={level + 1}
                hiddenIds={hiddenIds}
              />
            );
          })}
        </>
      )}
    </>
  );
}

interface CosmeticBenefitSingleSelectProps
  extends Pick<SelectSingleProps, 'value' | 'onValueUpdate'> {
  hiddenIds?: string[];
}

export function CosmeticBenefitSingleSelect({
  hiddenIds,
  ...props
}: CosmeticBenefitSingleSelectProps) {
  const listCosmeticBenefitsQuery = useListCosmeticBenefitsQuery();

  return (
    <Select {...props}>
      <Options
        {...props}
        benefits={listCosmeticBenefitsQuery.data || []}
        hiddenIds={hiddenIds}
      />
    </Select>
  );
}

interface CosmeticBenefitMultipleSelectProps
  extends Pick<SelectMultipleProps, 'value' | 'onValueUpdate'> {
  hiddenIds?: string[];
}

export function CosmeticBenefitMultipleSelect({
  hiddenIds,
  ...props
}: CosmeticBenefitMultipleSelectProps) {
  const listCosmeticBenefitsQuery = useListCosmeticBenefitsQuery();

  return (
    <Select {...props} multiple>
      <Options
        {...props}
        benefits={listCosmeticBenefitsQuery.data || []}
        hiddenIds={hiddenIds}
      />
    </Select>
  );
}
