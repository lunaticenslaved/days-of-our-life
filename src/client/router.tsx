import { Suspense } from 'react';
import { Route, Routes } from 'react-router';

import HomeRouter from './pages/home';
import FoodRouter from './pages/food';
import DaysRouter from './pages/days';
import CosmeticRouter from './pages/cosmetic';
import MedicamentsRouter from './pages/medicaments';
import {
  NavigationContextProvider,
  TheLeftNavigation,
} from '#/client/widgets/navigation';
import { DialogContextProvider } from '#/ui-lib/atoms/Dialog';
import { Box } from '#/ui-lib/atoms/Box';
import isPropValid from '@emotion/is-prop-valid';
import { StyleSheetManager } from 'styled-components';

export function AppRouter() {
  return (
    <StyleSheetManager shouldForwardProp={isPropValid}>
      <NavigationContextProvider>
        <DialogContextProvider>
          <Box
            color="background"
            style={{
              display: 'flex',
              height: '100%',
            }}>
            <Box component="aside">
              <TheLeftNavigation />
            </Box>

            <Box spacing={{ p: 4 }} overflow="auto" height="100%" flexGrow={1}>
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
            </Box>
          </Box>
        </DialogContextProvider>
      </NavigationContextProvider>
    </StyleSheetManager>
  );
}
