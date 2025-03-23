import { Outlet, Route, useParams } from 'react-router';

import { createNavigationHook } from '#/client/hooks/navigation';

import MedicamentCreate from './Create';
import MedicamentsRoot from './Root';
import MedicamentOverview from './[medicamentId]/Overview';
import MedicamentEdit from './[medicamentId]/Edit';
import { SubNavigation, SubNavigationItem } from '#/client/widgets/navigation';

type MedicamentId = { medicamentId: string };

const routes = {
  root: '/medicaments',

  // Medicaments
  medicamentCreate: '/medicaments/create',
  medicamentEdit: '/medicaments/:medicamentId/edit',
  medicamentOverview: '/medicaments/:medicamentId',
} as const;

export const MEDICAMENTS_NAVIGATION = {
  toRoot: () => routes.root,

  // Medicaments
  toMedicamentCreate: () => routes.medicamentCreate,
  toMedicamentEdit: ({ medicamentId }: MedicamentId) =>
    routes.medicamentEdit.replace(':medicamentId', medicamentId),
  toMedicamentOverview: ({ medicamentId }: MedicamentId) =>
    routes.medicamentOverview.replace(':medicamentId', medicamentId),
};

export function useMedicamentsPageParams() {
  return useParams<MedicamentId>();
}

export const useMedicamentsNavigation = createNavigationHook(MEDICAMENTS_NAVIGATION);

const SUBNAVIGATION_ITEMS: SubNavigationItem[] = [
  {
    to: MEDICAMENTS_NAVIGATION.toRoot(),
    title: 'Медикаменты',
  },
];

export default [
  <Route
    key="food"
    path={routes.root}
    element={
      <>
        <SubNavigation items={SUBNAVIGATION_ITEMS} />
        <Outlet />
      </>
    }>
    <Route index element={<MedicamentsRoot />} />
    <Route path={routes.medicamentCreate} element={<MedicamentCreate />} />
    <Route path={routes.medicamentOverview} element={<MedicamentOverview />} />
    <Route path={routes.medicamentEdit} element={<MedicamentEdit />} />
  </Route>,
];
