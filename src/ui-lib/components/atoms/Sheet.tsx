import { ClassNameProp, StyleProp } from '#/ui-lib/types';
import { PropsWithChildren } from 'react';

export function Sheet({
  children,
  ...props
}: PropsWithChildren & ClassNameProp & StyleProp) {
  return <div {...props}>{children}</div>;
}
