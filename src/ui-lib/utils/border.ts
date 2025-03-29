import { getDimensions, Dimension } from '#/ui-lib/utils/dimensions';
import { Size } from './size';
import { CSSProperties } from 'react';

const SIZES: Record<
  Size,
  {
    borderRadius: Dimension;
    borderWidth: Dimension;
  }
> = {
  m: {
    borderRadius: 2,
    borderWidth: 0.4,
  },
  s: {
    borderRadius: 2,
    borderWidth: 1,
  },
  l: {
    borderRadius: 2,
    borderWidth: 1,
  },
};

export type BorderProps = {
  borderRadius?: 'm';
  borderWidth?: 'm';
};

type StylesResult = Pick<
  CSSProperties,
  'borderRadius' | 'borderWidth' | 'borderColor' | 'borderStyle'
>;
export function getBorderStyles(props: BorderProps): StylesResult {
  const styles: StylesResult = {};

  if (props.borderRadius !== undefined) {
    styles.borderRadius = getDimensions(SIZES[props.borderRadius].borderRadius);
  }

  if (props.borderWidth !== undefined) {
    styles.borderWidth = getDimensions(SIZES[props.borderWidth].borderWidth);
    styles.borderColor = 'white'; // FIXME
    styles.borderStyle = 'solid';
  }

  return styles;
}
