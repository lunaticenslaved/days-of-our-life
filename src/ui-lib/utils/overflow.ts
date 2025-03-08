import { CSSProperties } from 'react';

export type OverflowProps = {
  overflow?: 'auto';
};

export function getOverflowStyles(props: OverflowProps): Pick<CSSProperties, 'overflow'> {
  return {
    overflow: props.overflow,
  };
}
