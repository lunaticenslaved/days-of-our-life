import { CSSProperties } from 'react';

const BASE_NUM = 5;
const BASE_UNIT = 'px';

export type Dimension = number;

export function getDimensions(space: Dimension): string {
  return `${BASE_NUM * space}${BASE_UNIT}`;
}

export type Spacings = {
  px?: Dimension;
  py?: Dimension;
  p?: Dimension;
  pt?: Dimension;
  pb?: Dimension;
  pl?: Dimension;
  pr?: Dimension;
};
export type SpacingProps = { spacing?: Spacings };

type GetSpacingsResult = Pick<
  CSSProperties,
  'padding' | 'margin' | 'paddingLeft' | 'paddingRight' | 'paddingTop' | 'paddingBottom'
>;
export function getSpacingsStyles({ spacing }: SpacingProps): GetSpacingsResult {
  if (!spacing) {
    return {};
  }

  const result: GetSpacingsResult = {};

  if (typeof spacing.p !== 'undefined') {
    result['padding'] = getDimensions(spacing.p);
  }

  if (typeof spacing.px !== 'undefined') {
    result['paddingLeft'] = getDimensions(spacing.px);
    result['paddingRight'] = getDimensions(spacing.px);
  }

  if (typeof spacing.py !== 'undefined') {
    result['paddingTop'] = getDimensions(spacing.py);
    result['paddingBottom'] = getDimensions(spacing.py);
  }

  if (typeof spacing.pl !== 'undefined') {
    result['paddingLeft'] = getDimensions(spacing.pl);
  }

  if (typeof spacing.pr !== 'undefined') {
    result['paddingRight'] = getDimensions(spacing.pr);
  }

  if (typeof spacing.pt !== 'undefined') {
    result['paddingTop'] = getDimensions(spacing.pt);
  }

  if (typeof spacing.pb !== 'undefined') {
    result['paddingBottom'] = getDimensions(spacing.pb);
  }

  return result;
}
