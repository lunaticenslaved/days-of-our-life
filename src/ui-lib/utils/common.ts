export function checkProps<TProps extends object>(props: Record<keyof TProps, boolean>) {
  return (prop: string) => {
    if (!(prop in props)) {
      return true;
    }

    return props[prop as keyof TProps];
  };
}
