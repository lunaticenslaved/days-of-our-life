import { Suspense } from 'react';
import { Route, Routes } from 'react-router';

import HomeRouter from './pages/home';
import FoodRouter, { FOOD_NAVIGATION } from './pages/food';
import DaysRouter, { DAYS_NAVIGATION } from './pages/days';
import CosmeticRouter, { COSMETIC_NAVIGATION } from '#/client/pages/cosmetic';
import { Link } from 'react-router-dom';
import { DialogContextProvider } from '#/client/components/Dialog';

export function AppRouter() {
  return (
    <DialogContextProvider>
      <div style={{ display: 'flex', padding: '10px' }}>
        <aside
          style={{
            minWidth: '100px',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
          }}>
          <Link to={FOOD_NAVIGATION.toRoot()}>Еда</Link>
          <Link to={DAYS_NAVIGATION.toRoot()}>Дни</Link>
          <Link to={COSMETIC_NAVIGATION.toRoot()}>Косметика</Link>
        </aside>
        <main style={{ flexGrow: 1, overflow: 'auto' }}>
          <Suspense>
            <Routes>
              {HomeRouter}
              {FoodRouter}
              {DaysRouter}
              {CosmeticRouter}
              {/* TODO add not found page */}
              <Route path="*" element={<div>not found</div>} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </DialogContextProvider>
  );
}
