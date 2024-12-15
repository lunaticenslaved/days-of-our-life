import { createNavigationHook } from '#ui/hooks/navigation';
import { Navigate, Outlet, Route, useParams } from 'react-router';

import DateRoot from './[date]/Root';
import StatisticsRootPage from './statistics/Root';
import DayPartsRootPage from './parts/Root';
import { toDateFormat } from '#shared/models/common';
import { Link } from 'react-router-dom';

type Date = { date: `${number}-${number}-${number}` };

const routes = {
  root: '/days',
  statistics: '/days/statistics',
  date: '/days/:date',
  dayParts: '/days/parts',
} as const;

export const DAYS_NAVIGATION = {
  toRoot: () => routes.root,
  toStatistics: () => routes.statistics,
  toDate: ({ date }: Date) => routes.date.replace(':date', date),
  toToday: () => routes.date.replace(':date', toDateFormat(new Date())),
  toDayParts: () => routes.dayParts,
};

export const useDaysNavigation = createNavigationHook(DAYS_NAVIGATION);

export function useDaysPageParams() {
  return useParams<Date>();
}

export default [
  <Route
    key="days"
    path={routes.root}
    element={
      <>
        <aside style={{ width: '100px', display: 'flex', flexDirection: 'column' }}>
          <Link to={DAYS_NAVIGATION.toToday()}>Дата</Link>
          <Link to={DAYS_NAVIGATION.toStatistics()}>Статистика</Link>
          <Link to={DAYS_NAVIGATION.toDayParts()}>К периодам дня</Link>
        </aside>
        <div>
          <Outlet />
        </div>
      </>
    }>
    <Route index element={<Navigate to={DAYS_NAVIGATION.toToday()} />} />
    <Route key={routes.dayParts} path={routes.dayParts} element={<DayPartsRootPage />} />,
    <Route
      key={routes.statistics}
      path={routes.statistics}
      element={<StatisticsRootPage />}
    />
    ,
    <Route key={routes.date} path={routes.date} element={<DateRoot />} />,
  </Route>,
];
