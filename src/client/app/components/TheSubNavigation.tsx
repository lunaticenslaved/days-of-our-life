import { matchPath, useLocation } from 'react-router';
import { Selectable } from '#/ui-lib/molecules/Selectable';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Button } from '#/ui-lib/atoms/Button/Button';
import { useNavigationContext } from '#/client/widgets/navigation';

export function TheSubNavigation() {
  const { subNavigationItems } = useNavigationContext();
  const { pathname } = useLocation();

  if (subNavigationItems.length === 0) {
    return null;
  }

  const currentItem = subNavigationItems.find(link => matchPath(link.to, pathname));

  return (
    <Selectable value={currentItem?.to}>
      <Flex direction="column" gap={4} spacing={{ py: 4, px: 2 }}>
        {subNavigationItems.map(item => {
          return (
            <Selectable.Item key={item.to} value={item.to}>
              {({ isActive }) => {
                return (
                  <Button
                    component="router-link"
                    view="clear"
                    color={isActive ? 'primary' : 'secondary'}
                    to={item.to}>
                    {item.title}
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
