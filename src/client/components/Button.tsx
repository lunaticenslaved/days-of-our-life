import { AsChildProp } from '#/client/components/Slot';
import { ButtonHTMLAttributes } from 'react';

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & AsChildProp) {
  return <button type="button" {...props} />;
}
