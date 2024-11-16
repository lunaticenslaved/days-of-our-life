import { Suspense } from 'react';
import { Route, Routes } from 'react-router';

import HomeRouter from './pages/home';
import FoodRouter, { FOOD_NAVIGATION } from './pages/food';
import DaysRouter, { DAYS_NAVIGATION } from './pages/days';
import { Link } from 'react-router-dom';
import { DialogContextProvider } from '#ui/components/Dialog';

export function AppRouter() {
  return (
    <DialogContextProvider>
      <div style={{ display: 'flex', padding: '10px' }}>
        <aside style={{ width: '100px', display: 'flex', flexDirection: 'column' }}>
          <Link to={FOOD_NAVIGATION.toRoot()}>Еда</Link>
          <Link to={DAYS_NAVIGATION.toRoot()}>Дни</Link>
        </aside>
        <Suspense>
          <Routes>
            {HomeRouter}
            {FoodRouter}
            {DaysRouter}
            {/* TODO add not found page */}
            <Route path="*" element={<div>not found</div>} />
          </Routes>
        </Suspense>
      </div>
    </DialogContextProvider>
  );
}
