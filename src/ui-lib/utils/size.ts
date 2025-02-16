// const BASE_SIZE = '5px';
const BASE_SIZE_NUM = 5;
const BASE_SIZE_UNIT = 'px';

export function getSize(space: number): string {
  return `${BASE_SIZE_NUM * space}${BASE_SIZE_UNIT}`;
}
