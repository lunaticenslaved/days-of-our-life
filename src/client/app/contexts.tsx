import { PropsWithChildren } from 'react';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import { NavigationContextProvider } from '#/client/widgets/navigation';
import { DialogContextProvider } from '#/ui-lib/components';
import {
  CosmeticCacheProvider,
  CosmeticEventBusProvider,
} from '#/client/entities/cosmetic';
import { FoodCacheProvider } from '#/client/entities/food';

import { AppContextProvider } from './AppContext';

export function AppContext({
  children,
  api,
}: PropsWithChildren & {
  api: 'real' | 'test';
}) {
  return (
    <StyleSheetManager shouldForwardProp={isPropValid}>
      <AppContextProvider api={api}>
        <NavigationContextProvider>
          <DialogContextProvider>
            <CosmeticEventBusProvider>
              <FoodCacheProvider>
                <CosmeticCacheProvider>{children}</CosmeticCacheProvider>
              </FoodCacheProvider>
            </CosmeticEventBusProvider>
          </DialogContextProvider>
        </NavigationContextProvider>
      </AppContextProvider>
    </StyleSheetManager>
  );
}
