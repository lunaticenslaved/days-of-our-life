import { getDimensions } from '#/ui-lib/utils/dimensions';
import { CSSProperties } from 'react';

export type BorderRadius = 'm';

const SIZES: Record<BorderRadius, number> = {
  m: 2,
};

export function getBorderRadiusStyles(
  radius: BorderRadius,
): Pick<CSSProperties, 'borderRadius'> {
  return {
    borderRadius: getDimensions(SIZES[radius]),
  };
}
