import { LeftNavigationItem } from '../types';
import { Button } from '#/ui-lib/atoms/Button';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Selectable } from '#/ui-lib/molecules/Selectable';
import { useLocation } from 'react-router';

export function TheLeftNavigation({ items }: { items: LeftNavigationItem[] }) {
  const location = useLocation();

  const value = items.find(link => location.pathname.startsWith(link.to))?.to;

  return (
    <Selectable value={value}>
      <Flex
        height="100%"
        direction="column"
        justifyContent="center"
        gap={4}
        spacing={{ py: 4, px: 2 }}>
        {items.map(({ icon, to }) => {
          return (
            <Selectable.Item key={to} value={to}>
              {({ isActive }) => {
                return (
                  <Button
                    to={to}
                    component="router-link"
                    view="clear"
                    color={isActive ? 'primary' : 'secondary'}>
                    {icon}
                  </Button>
                );
              }}
            </Selectable.Item>
          );
        })}
      </Flex>
    </Selectable>
  );
}
