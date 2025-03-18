import { useNavigationContext } from '../context';
import { useEffect } from 'react';

export type SubNavigationItem = {
  to: string;
  title: string;
};

interface SubNavigationProps {
  items: SubNavigationItem[];
}

export function SubNavigation({ items }: SubNavigationProps) {
  const { setSubNavigation } = useNavigationContext();

  useEffect(() => {
    setSubNavigation(items);
  }, [items, setSubNavigation]);

  return <></>;
}
