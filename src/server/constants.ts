import { AppEnvironment } from '#/shared/constants/app';
import path from 'path';

export const ROOT_PATH = path.resolve(__dirname, '../../');
export const APP_ENV = (process.env.APP_ENV as AppEnvironment) || AppEnvironment.Preprod;

export const PORT = Number(process.env.PORT) || 3000;

export const CORS_ORIGIN_WHITELIST = JSON.parse(
  process.env.CORS_ORIGIN_WHITELIST || '[]',
);

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
export const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;
