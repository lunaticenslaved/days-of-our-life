import { Suspense } from 'react';
import { Route, Routes } from 'react-router';

import HomeRouter from '../pages/home';
import FoodRouter, { FOOD_NAVIGATION } from '../pages/food';
import DaysRouter, { DAYS_NAVIGATION } from '../pages/days';
import CosmeticRouter, { COSMETIC_NAVIGATION } from '../pages/cosmetic';
import MedicamentsRouter, { MEDICAMENTS_NAVIGATION } from '../pages/medicaments';
import { NavigationContextProvider } from '#/client/widgets/navigation';
import { Box, DialogContextProvider } from '#/ui-lib/components';
import isPropValid from '@emotion/is-prop-valid';
import { StyleSheetManager } from 'styled-components';
import { FoodCacheProvider, FoodIcon } from '#/client/entities/food';
import { DaysIcon } from '#/client/entities/days';
import {
  CosmeticCacheProvider,
  CosmeticEventBusProvider,
  CosmeticIcon,
} from '#/client/entities/cosmetic';
import { MedicamentsIcon } from '#/client/entities/medicaments';
import { Flex } from '#/ui-lib/components/atoms/Flex';
import { TheLeftNavigation } from './components/TheLeftNavigation';
import { TheSubNavigation } from './components/TheSubNavigation';
import { PageContextProvider } from '#/client/widgets/Page';

const LINKS = [
  {
    to: FOOD_NAVIGATION.toRoot(),
    icon: <FoodIcon size={30} />,
    title: 'Food',
  },
  {
    to: DAYS_NAVIGATION.toRoot(),
    icon: <DaysIcon size={30} />,
    title: 'Days',
  },
  {
    to: COSMETIC_NAVIGATION.toRoot(),
    icon: <CosmeticIcon size={30} />,
    title: 'Cosmetic',
  },
  {
    to: MEDICAMENTS_NAVIGATION.toRoot(),
    icon: <MedicamentsIcon size={30} />,
    title: 'Medicaments',
  },
];

export function App() {
  return (
    <StyleSheetManager shouldForwardProp={isPropValid}>
      <NavigationContextProvider>
        <DialogContextProvider>
          <CosmeticEventBusProvider>
            <FoodCacheProvider>
              <CosmeticCacheProvider>
                <Box color="background" height="100%">
                  <Flex height="100%">
                    <Flex direction="row" height="100%">
                      <TheLeftNavigation items={LINKS} />
                      <TheSubNavigation />
                    </Flex>

                    <PageContextProvider>
                      <Box overflow="auto" height="100%" flexGrow={1}>
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
                    </PageContextProvider>
                  </Flex>
                </Box>
              </CosmeticCacheProvider>
            </FoodCacheProvider>
          </CosmeticEventBusProvider>
        </DialogContextProvider>
      </NavigationContextProvider>
    </StyleSheetManager>
  );
}
