import { NavigationBarAction } from './NavigationBarAction';

import { ReactNode, useEffect, useState } from 'react';

import './NavigationBar.scss';
import { Context } from './Context';
import { rootClass } from './classes';

interface NavigationBarProps {
  value?: string;
  onChange?(value?: string): void;
  children?: ReactNode;
}

export function NavigationBar({
  value: valueProp,
  onChange,
  children,
}: NavigationBarProps) {
  const [value, _setValue] = useState(() => valueProp);

  const setValue = (newValue?: string) => {
    _setValue(newValue);
    onChange?.(newValue);
  };

  useEffect(() => {
    setValue(valueProp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueProp]);

  return (
    <Context.Provider value={{ value, setValue }}>
      <nav className={rootClass}>
        <ul>{children}</ul>
      </nav>
    </Context.Provider>
  );
}

NavigationBar.Action = NavigationBarAction;
