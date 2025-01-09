import { actionClass, activeActionClass } from './classes';
import cn from 'classnames';
import { useNavigationBarContext } from './Context';
import { ReactNode } from 'react';

interface NavigationBarActionProps {
  value: string;
  title: string;
  icon: ReactNode;
  onClick?(): void;
}

// FIXME add title

export function NavigationBarAction({ onClick, value, icon }: NavigationBarActionProps) {
  const context = useNavigationBarContext();

  return (
    <li
      role="button"
      className={cn(actionClass, {
        [activeActionClass]: context.value === value,
      })}
      onClick={() => {
        onClick?.();
        context.setValue(value);
      }}>
      {icon}
    </li>
  );
}
