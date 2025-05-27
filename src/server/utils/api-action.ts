import { RequestContext } from '#/server/utils/RequestContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ApiActions: Record<string, Options<any, any>> = {};

type Options<TReq extends { action: string }, TRes> = {
  action: string;
  validator: Zod.ZodType<TReq>;
  handler: (data: TReq, context: RequestContext) => Promise<TRes>;
};

export function createApiAction<TReq extends { action: string }, TRes>(
  arg: Options<TReq, TRes>,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ApiActions[arg.action] = arg as unknown as Options<any, any>;

  return arg;
}
