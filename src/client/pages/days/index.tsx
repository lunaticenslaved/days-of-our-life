import { createNavigationHook } from '#/client/hooks/navigation';
import { Navigate, Outlet, Route } from 'react-router';

import CalendarRoot from './calendar/Root';
import TrackerRoot from './tracker/Root';
import DayPartsRootPage from './parts/Root';
import { Link } from 'react-router-dom';
import { DateFormat } from '#/shared/models/date';

type Date = { date: DateFormat };

const routes = {
  root: '/days',
  calendar: '/days/calendar',
  tracker: '/days/tracker',
  dayParts: '/days/parts',
  medicaments: '/days/medicaments',
} as const;

export const DAYS_NAVIGATION = {
  toRoot: () => routes.root,
  toCalendar: () => routes.calendar,
  toTracker: (_arg: { date?: DateFormat } = {}) => routes.tracker,
  toDayParts: () => routes.dayParts,
};

export const useDaysNavigation = createNavigationHook(DAYS_NAVIGATION);

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
          <Link to={DAYS_NAVIGATION.toTracker()}>Трекер</Link>
          <Link to={DAYS_NAVIGATION.toCalendar()}>Календарь</Link>
          <Link to={DAYS_NAVIGATION.toDayParts()}>К периодам дня</Link>
        </aside>
        <div style={{ flexGrow: 1, overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
    }>
    <Route index element={<Navigate to={DAYS_NAVIGATION.toTracker()} />} />
    <Route path={routes.calendar} element={<CalendarRoot />} />
    <Route path={routes.dayParts} element={<DayPartsRootPage />} />,
    <Route path={routes.tracker} element={<TrackerRoot />} />,
  </Route>,
];
