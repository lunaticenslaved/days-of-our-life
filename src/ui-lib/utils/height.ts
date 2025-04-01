import { getDimensions, isDimension } from '#/ui-lib/utils/dimensions';
import { CSSProperties } from 'react';

export type HeightProps = {
  height?: CSSProperties['height'];
  minHeight?: CSSProperties['minHeight'];
  maxHeight?: CSSProperties['maxHeight'];
};

type GetHeightStylesResult = Pick<CSSProperties, 'height' | 'minHeight' | 'maxHeight'>;
export function getHeightStyles({
  height,
  minHeight,
  maxHeight,
}: HeightProps): GetHeightStylesResult {
  const result: GetHeightStylesResult = {};

  if (height) {
    result.height = isDimension(height) ? getDimensions(height) : height;
  }

  if (minHeight) {
    result.minHeight = isDimension(minHeight) ? getDimensions(minHeight) : minHeight;
  }

  if (maxHeight) {
    result.maxHeight = isDimension(maxHeight) ? getDimensions(maxHeight) : maxHeight;
  }

  return result;
}

export const SHOULD_FORWARD_HEIGHT: Record<keyof HeightProps, boolean> = {
  height: false,
  minHeight: false,
  maxHeight: false,
};
