import {
  CosmeticBenefit,
  CosmeticBenefitTree,
  CosmeticUtils,
} from '#/shared/models/cosmetic';
import {
  Select,
  SelectMultipleProps,
  SelectSingleProps,
} from '#/client/components/Select';
import { useMemo } from 'react';
import { useListCosmeticBenefitsQuery } from '#/client/store';
import { differenceWith } from 'lodash';

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
  extends Pick<SelectSingleProps, 'modelValue' | 'onModelValueChange'> {
  hiddenIds?: string[];
}

export function CosmeticBenefitSingleSelect({
  hiddenIds,
  ...props
}: CosmeticBenefitSingleSelectProps) {
  const listCosmeticBenefitsQuery = useListCosmeticBenefitsQuery();

  const benefits = useMemo(() => {
    const items = listCosmeticBenefitsQuery.data || [];

    if (!hiddenIds?.length) {
      return items;
    }

    return differenceWith(items, hiddenIds, (item, id) => item.id === id);
  }, [hiddenIds, listCosmeticBenefitsQuery.data]);

  return (
    <Select {...props}>
      <Options {...props} benefits={benefits} hiddenIds={hiddenIds} />
    </Select>
  );
}

interface CosmeticBenefitMultipleSelectProps
  extends Pick<SelectMultipleProps, 'modelValue' | 'onModelValueChange'> {
  hiddenIds?: string[];
}

export function CosmeticBenefitMultipleSelect({
  hiddenIds,
  ...props
}: CosmeticBenefitMultipleSelectProps) {
  const listCosmeticBenefitsQuery = useListCosmeticBenefitsQuery();

  const benefits = useMemo(() => {
    const items = listCosmeticBenefitsQuery.data || [];

    if (!hiddenIds?.length) {
      return items;
    }

    return differenceWith(items, hiddenIds, (item, id) => item.id === id);
  }, [hiddenIds, listCosmeticBenefitsQuery.data]);

  return (
    <Select {...props} multiple>
      <Options {...props} benefits={benefits} hiddenIds={hiddenIds} />
    </Select>
  );
}
