import { CSSProperties } from 'react';

export type HeightProps = {
  height?: `${number}%`;
};

type GetHeightStylesResult = Pick<CSSProperties, 'height'>;
export function getHeightStyles({ height }: HeightProps): GetHeightStylesResult {
  const result: GetHeightStylesResult = {};

  result.height = height;

  return result;
}
