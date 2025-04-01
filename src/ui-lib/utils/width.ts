import { getDimensions, isDimension } from '#/ui-lib/utils/dimensions';
import { CSSProperties } from 'react';

export type WidthProps = {
  width?: CSSProperties['width'];
  minWidth?: CSSProperties['minWidth'];
  maxWidth?: CSSProperties['maxWidth'];
};

type GetWidthStylesResult = Pick<CSSProperties, 'width' | 'minWidth' | 'maxWidth'>;
export function getWidthStyles({
  width,
  minWidth,
  maxWidth,
}: WidthProps): GetWidthStylesResult {
  const result: GetWidthStylesResult = {};

  if (width !== undefined) {
    result.width = isDimension(width) ? getDimensions(width) : width;
  }

  if (minWidth !== undefined) {
    result.minWidth = isDimension(minWidth) ? getDimensions(minWidth) : minWidth;
  }

  if (maxWidth !== undefined) {
    result.maxWidth = isDimension(maxWidth) ? getDimensions(maxWidth) : maxWidth;
  }

  return result;
}

export const SHOULD_FORWARD_WIDTH: Record<keyof WidthProps, boolean> = {
  width: false,
  maxWidth: false,
  minWidth: false,
};
