import { createNavigationHook } from '#ui/hooks/navigation';
import { Navigate, Route, useParams } from 'react-router';

import DateRoot from './[date]/Root';
import { formatDate } from './utils';

type Date = { date: `${number}-${number}-${number}` };

const routes = {
  root: '/days',

  date: '/days/:date',
} as const;

export const DAYS_NAVIGATION = {
  toRoot: () => routes.root,
  toDate: ({ date }: Date) => routes.date.replace(':date', date),
};

export const useDaysNavigation = createNavigationHook(DAYS_NAVIGATION);

export function useDaysPageParams() {
  return useParams<Date>();
}

export default [
  <Route
    key={routes.root}
    path={routes.root}
    element={
      <Navigate
        to={DAYS_NAVIGATION.toDate({ date: formatDate(new Date().toISOString()) })}
      />
    }
  />,

  // Products
  <Route key={routes.date} path={routes.date} element={<DateRoot />} />,
];
