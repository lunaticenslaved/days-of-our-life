export type FieldState = 'valid' | 'error';

export function fieldStateMap<T>(
  arg: Record<FieldState, T> | ((state: FieldState) => T),
): Record<FieldState, T> {
  if (typeof arg === 'function') {
    return {
      valid: arg('valid'),
      error: arg('error'),
    };
  }

  return arg;
}
