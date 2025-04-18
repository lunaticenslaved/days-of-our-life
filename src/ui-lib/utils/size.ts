export const DEFAULT_SIZE: Size = 'm';
export const SIZES: Size[] = ['s', 'm', 'l'];

export type Size = 's' | 'm' | 'l';

export function sizeMap<T>(arg: ((size: Size) => T) | Record<Size, T>): Record<Size, T> {
  if (typeof arg === 'function') {
    return {
      s: arg('s'),
      m: arg('m'),
      l: arg('l'),
    };
  }

  return arg;
}
