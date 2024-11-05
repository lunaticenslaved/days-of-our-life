import { PrismaClient } from '@prisma/client';

export interface AppContext {}

export const appContext: AppContext = {};

export interface RequestContext {
  prisma: PrismaClient;
}
