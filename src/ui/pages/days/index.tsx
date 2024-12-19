import { createNavigationHook } from '#ui/hooks/navigation';
import { Outlet, Route, useParams } from 'react-router';

import Root from './Root';
import DateRoot from './[date]/Root';
import StatisticsRootPage from './statistics/Root';
import DayPartsRootPage from './parts/Root';
import { Link } from 'react-router-dom';
import { DateUtils } from '#/shared/models/date';

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
  toToday: () => routes.date.replace(':date', DateUtils.toDateFormat(new Date())),
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
      <div style={{ width: '100%', display: 'flex' }}>
        <aside
          style={{
            width: '100px',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
          }}>
          <Link to={DAYS_NAVIGATION.toRoot()}>Календарь</Link>
          <Link to={DAYS_NAVIGATION.toToday()}>Дата</Link>
          <Link to={DAYS_NAVIGATION.toStatistics()}>Статистика</Link>
          <Link to={DAYS_NAVIGATION.toDayParts()}>К периодам дня</Link>
        </aside>
        <div style={{ flexGrow: 1, overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
    }>
    <Route index element={<Root />} />
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
