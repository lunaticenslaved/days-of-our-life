import { hydrateRoot, createRoot } from 'react-dom/client';

import { AppClient } from './app/app-client';

const IS_RUNNING_SSR_IN_BROWSER =
  typeof window !== 'undefined' ? window.__IS_SSR__ || false : false;

const element = document.getElementById('root') as HTMLElement;

console.log('IS_RUNNING_SSR_IN_BROWSER', IS_RUNNING_SSR_IN_BROWSER);

if (IS_RUNNING_SSR_IN_BROWSER) {
  hydrateRoot(element, <AppClient />);
} else {
  createRoot(element).render(<AppClient />);
}
