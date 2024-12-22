import { createNavigationHook } from '#ui/hooks/navigation';
import { Navigate, Outlet, Route, useParams } from 'react-router';

import CalendarRoot from './calendar/Root';
import DateRoot from './[date]/Root';
import DayPartsRootPage from './parts/Root';
import MedicamentsPage from './medicaments/Root';
import { Link } from 'react-router-dom';
import { DateUtils } from '#/shared/models/date';

type Date = { date: `${number}-${number}-${number}` };

const routes = {
  root: '/days',
  calendar: '/days/calendar',
  date: '/days/:date',
  dayParts: '/days/parts',
  medicaments: '/days/medicaments',
} as const;

export const DAYS_NAVIGATION = {
  toRoot: () => routes.root,
  toCalendar: () => routes.calendar,
  toDate: ({ date }: Date) => routes.date.replace(':date', date),
  toToday: () => routes.date.replace(':date', DateUtils.toDateFormat(new Date())),
  toDayParts: () => routes.dayParts,
  toMedicaments: () => routes.medicaments,
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
          <Link to={DAYS_NAVIGATION.toCalendar()}>Календарь</Link>
          <Link to={DAYS_NAVIGATION.toToday()}>Дата</Link>
          <Link to={DAYS_NAVIGATION.toDayParts()}>К периодам дня</Link>
          <Link to={DAYS_NAVIGATION.toMedicaments()}>Медикаменты</Link>
        </aside>
        <div style={{ flexGrow: 1, overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
    }>
    <Route index element={<Navigate to={DAYS_NAVIGATION.toCalendar()} />} />
    <Route path={routes.calendar} element={<CalendarRoot />} />
    <Route path={routes.dayParts} element={<DayPartsRootPage />} />,
    <Route path={routes.medicaments} element={<MedicamentsPage />} />,
    <Route path={routes.date} element={<DateRoot />} />,
  </Route>,
];
