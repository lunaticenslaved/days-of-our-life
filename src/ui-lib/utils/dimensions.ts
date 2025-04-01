const BASE_NUM = 5;
const BASE_UNIT = 'px';

export type Dimension = `${number}%` | `${number}px` | number;

export function getDimensions(space: Dimension): string {
  if (typeof space === 'number') {
    return `${BASE_NUM * space}${BASE_UNIT}`;
  }

  return space;
}

export function isDimension(value: unknown): value is Dimension {
  if (typeof value === 'number') {
    return true;
  }

  if (typeof value === 'string') {
    return value.endsWith('%') || value.endsWith('px');
  }

  return false;
}
