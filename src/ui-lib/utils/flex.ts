import { CSSProperties } from 'react';

export type FlexChildProps = {
  flexGrow?: CSSProperties['flexGrow'];
};

type GetFlexChildStyles = Pick<CSSProperties, 'flexGrow'>;
export function getFlexChildStyles(props: FlexChildProps): GetFlexChildStyles {
  const result: GetFlexChildStyles = {};

  result.flexGrow = props.flexGrow;

  return result;
}
