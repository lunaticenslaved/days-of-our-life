import {
  CosmeticBenefit,
  CosmeticBenefitTree,
  CosmeticUtils,
} from '#/shared/models/cosmetic';
import { ReactNode, useMemo } from 'react';

interface CosmeticBenefitsListProps {
  benefits: CosmeticBenefit[];
  renderActions(benefit: CosmeticBenefit): ReactNode;
}

export function CosmeticBenefitsList({ benefits, ...props }: CosmeticBenefitsListProps) {
  const tree = useMemo(() => {
    return CosmeticUtils.treeBenefits(benefits);
  }, [benefits]);

  return <Tree tree={tree} {...props} />;
}

function Tree({
  tree,
  ...props
}: Omit<CosmeticBenefitsListProps, 'benefits'> & { tree: CosmeticBenefitTree[] }) {
  const { renderActions } = props;

  return (
    <ul>
      {tree.map(benefit => {
        return (
          <li key={benefit.id}>
            <div style={{ display: 'flex' }}>
              <p>{benefit.name}</p>
              {renderActions(benefit)}
            </div>
            {benefit.children.length > 0 && (
              <div style={{ paddingLeft: '20px' }}>
                <Tree tree={benefit.children} {...props} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
