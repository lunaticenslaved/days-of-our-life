import { useMemo } from 'react';
import { useNavigate } from 'react-router';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExpectedMap = Record<string, (...args: any[]) => string>;

type ActionsMap<T extends ExpectedMap> = {
  [P in keyof T]: T[P] extends (...args: infer A) => string ? (...args: A) => void : never;
};

export function useNavigation<T extends ExpectedMap>(pathMap: T) {
  const navigate = useNavigate();

  return useMemo(
    () => ({
      href: pathMap,
      ...Object.entries(pathMap).reduce(
        (acc, [key, getHref]) => ({
          ...acc,
          [key]: (...args: unknown[]) => navigate(getHref(...args)),
        }),
        {} as ActionsMap<T>,
      ),
    }),
    [pathMap, navigate],
  );
}

export function createNavigationHook<TMap extends ExpectedMap>(routes: TMap) {
  return () => useNavigation(routes);
}
