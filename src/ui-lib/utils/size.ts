export const DEFAULT_SIZE: Size = 'm';

export type Size = 's' | 'm' | 'l';

export function recordSize<T>(fn: (size: Size) => T): Record<Size, T> {
  return {
    s: fn('s'),
    m: fn('m'),
    l: fn('l'),
  };
}
