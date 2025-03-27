import { CSSProperties } from 'react';
import { Dimension, getDimensions } from './dimensions';

export type Spacing = {
  // Padding
  px?: Dimension;
  py?: Dimension;
  p?: Dimension;
  pt?: Dimension;
  pb?: Dimension;
  pl?: Dimension;
  pr?: Dimension;

  // Margin
  mx?: Dimension;
  my?: Dimension;
  m?: Dimension;
  mt?: Dimension;
  mb?: Dimension;
  ml?: Dimension;
  mr?: Dimension;
};

export type SpacingProps = { spacing?: Spacing };

export function getSpacingStyles(spacing: Spacing): CSSProperties {
  const result: CSSProperties = {};

  // Padding
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

  // Margin
  if (typeof spacing.m !== 'undefined') {
    result['margin'] = getDimensions(spacing.m);
  }
  if (typeof spacing.mx !== 'undefined') {
    result['marginLeft'] = getDimensions(spacing.mx);
    result['marginRight'] = getDimensions(spacing.mx);
  }
  if (typeof spacing.my !== 'undefined') {
    result['marginTop'] = getDimensions(spacing.my);
    result['marginBottom'] = getDimensions(spacing.my);
  }
  if (typeof spacing.ml !== 'undefined') {
    result['marginLeft'] = getDimensions(spacing.ml);
  }
  if (typeof spacing.mr !== 'undefined') {
    result['marginRight'] = getDimensions(spacing.mr);
  }
  if (typeof spacing.mt !== 'undefined') {
    result['marginTop'] = getDimensions(spacing.mt);
  }
  if (typeof spacing.mb !== 'undefined') {
    result['marginBottom'] = getDimensions(spacing.mb);
  }

  return result;
}

export function spacingMap(spacing: Spacing): Spacing {
  return spacing;
}
