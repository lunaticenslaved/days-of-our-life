import { LC } from '#/shared/types';

declare global {
  interface Window {
    __IS_SSR__?: boolean;
    LC: LC;
  }
}
