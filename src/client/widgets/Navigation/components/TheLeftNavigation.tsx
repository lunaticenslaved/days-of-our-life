import { NavigationBar } from '#/client/components/NavigationBar';
import { CosmeticIcon } from '#/client/entities/cosmetic';
import { DaysIcon } from '#/client/entities/days';
import { FoodIcon } from '#/client/entities/food';
import { MedicamentsIcon } from '#/client/entities/medicament';
import { COSMETIC_NAVIGATION } from '#/client/pages/cosmetic';
import { DAYS_NAVIGATION } from '#/client/pages/days';
import { FOOD_NAVIGATION } from '#/client/pages/food';
import { MEDICAMENTS_NAVIGATION } from '#/client/pages/medicaments';
import { useLocation, useNavigate } from 'react-router';

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
  const navigate = useNavigate();

  return (
    <NavigationBar
      value={LINKS.find(link => location.pathname.startsWith(link.to))?.to}
      onChange={newPathname => {
        if (newPathname) {
          navigate(newPathname);
        }
      }}>
      {LINKS.map(({ icon, title, to }) => {
        return <NavigationBar.Action title={title} value={to} icon={icon} />;
      })}
    </NavigationBar>
  );
}
