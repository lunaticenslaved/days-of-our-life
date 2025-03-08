import { CosmeticIcon } from '#/client/entities/cosmetic';
import { DaysIcon } from '#/client/entities/days';
import { FoodIcon } from '#/client/entities/food';
import { MedicamentsIcon } from '#/client/entities/medicament';
import { COSMETIC_NAVIGATION } from '#/client/pages/cosmetic';
import { DAYS_NAVIGATION } from '#/client/pages/days';
import { FOOD_NAVIGATION } from '#/client/pages/food';
import { MEDICAMENTS_NAVIGATION } from '#/client/pages/medicaments';
import { Button } from '#/ui-lib/atoms/Button';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Selectable } from '#/ui-lib/molecules/Selectable';
import { useLocation } from 'react-router';

const LINKS = [
  {
    to: FOOD_NAVIGATION.toRoot(),
    icon: <FoodIcon size={30} />,
    title: 'Food',
  },
  {
    to: DAYS_NAVIGATION.toRoot(),
    icon: <DaysIcon size={30} />,
    title: 'Days',
  },
  {
    to: COSMETIC_NAVIGATION.toRoot(),
    icon: <CosmeticIcon size={30} />,
    title: 'Cosmetic',
  },
  {
    to: MEDICAMENTS_NAVIGATION.toRoot(),
    icon: <MedicamentsIcon size={30} />,
    title: 'Medicaments',
  },
];

export function TheLeftNavigation() {
  const location = useLocation();

  const value = LINKS.find(link => location.pathname.startsWith(link.to))?.to;

  return (
    <Selectable value={value}>
      <Flex direction="column" gap={4} spacing={{ py: 4, px: 2 }}>
        {LINKS.map(({ icon, to }) => {
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
