import { AppEnvironment } from '#/shared/constants/app';

export interface LC {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
  appEnv: AppEnvironment;
}
