import { nonReachable } from '#/shared/utils';
import { getDimensions } from '#/ui-lib/utils/dimensions';
import { CSSProperties } from 'react';

export type HeightProps = {
  height?: `${number}%` | number;
};

type GetHeightStylesResult = Pick<CSSProperties, 'height'>;
export function getHeightStyles({ height }: HeightProps): GetHeightStylesResult {
  const result: GetHeightStylesResult = {};

  if (typeof height === 'number') {
    result.height = getDimensions(height);
  } else if (typeof height === 'string') {
    result.height = height;
  } else if (!height) {
    //
  } else {
    nonReachable(height);
  }

  return result;
}
