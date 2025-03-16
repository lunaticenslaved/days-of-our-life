const BASE_NUM = 5;
const BASE_UNIT = 'px';

export type Dimension = number;

export function getDimensions(space: Dimension): string {
  return `${BASE_NUM * space}${BASE_UNIT}`;
}
