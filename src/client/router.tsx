import { Suspense } from 'react';
import { Route, Routes } from 'react-router';

import HomeRouter from './pages/home';
import FoodRouter from './pages/food';
import DaysRouter from './pages/days';
import CosmeticRouter from './pages/cosmetic';
import MedicamentsRouter from './pages/medicaments';
import { DialogContextProvider } from '#/client/components/Dialog';
import {
  NavigationContextProvider,
  TheLeftNavigation,
} from '#/client/widgets/Navigation';

export function AppRouter() {
  return (
    <NavigationContextProvider>
      <DialogContextProvider>
        <div
          style={{
            display: 'flex',
            height: '100%',
          }}>
          <aside style={{ padding: '20px' }}>
            <TheLeftNavigation />
          </aside>

          <main
            style={{
              flexGrow: 1,
              overflow: 'auto',
              padding: '30px',
              backgroundColor: 'rgba(255,255,255,1)',
              height: '100%',
              borderRadius: '20px 0 0 20px',
            }}>
            <Suspense>
              <Routes>
                {HomeRouter}
                {FoodRouter}
                {DaysRouter}
                {CosmeticRouter}
                {MedicamentsRouter}
                {/* TODO add not found page */}
                <Route path="*" element={<div>not found</div>} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </DialogContextProvider>
    </NavigationContextProvider>
  );
}
