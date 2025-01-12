import {
  CosmeticBenefit,
  CosmeticBenefitTree,
  CosmeticUtils,
} from '#/shared/models/cosmetic';
import { Select, SelectProps } from '#/client/components/Select';
import { ModelValueProps } from '#/client/types';
import { useMemo } from 'react';

export interface CosmeticBenefitSelectProps
  extends ModelValueProps<string>,
    Omit<SelectProps, keyof ModelValueProps> {
  benefits: CosmeticBenefit[];
  hiddenIds?: string[];
}

export function CosmeticBenefitSelect({
  benefits,
  hiddenIds,
  ...props
}: CosmeticBenefitSelectProps) {
  const tree = useMemo(() => {
    return CosmeticUtils.treeBenefits(benefits);
  }, [benefits]);

  return (
    <Select {...props}>
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
    </Select>
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
