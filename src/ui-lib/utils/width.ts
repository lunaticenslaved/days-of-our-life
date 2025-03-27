import { CSSProperties } from 'react';

export type WidthProps = {
  width?: `${number}%` | `${number}px`;
};

type GetWidthStylesResult = Pick<CSSProperties, 'width'>;
export function getWidthStyles({ width }: WidthProps): GetWidthStylesResult {
  const result: GetWidthStylesResult = {};

  result.width = width;

  return result;
}
