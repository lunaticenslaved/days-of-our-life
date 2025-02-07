export function nonReachable(arg: never): never {
  return arg;
}

export function assertDefined<T>(
  data: T | null | undefined,
): asserts data is NonNullable<T> {
  if (data === null || data === undefined) {
    throw new Error('Assert not work');
  }
}

export function undefinedOnError<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
): (...args: TArgs) => TReturn | undefined {
  return (...args: TArgs) => {
    try {
      return fn(...args);
    } catch (error) {
      console.warn('Catched error', error);

      return undefined;
    }
  };
}
