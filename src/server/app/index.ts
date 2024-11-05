import { APP_ENV } from '#server/constants';
import { AppEnvironment } from '#shared/constants/app';
import { createApp as createAppDev } from './app.dev';
import { createApp as createAppProd } from './app.prod';

export const createApp = APP_ENV === AppEnvironment.Dev ? createAppDev : createAppProd;
