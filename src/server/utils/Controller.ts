import { Request } from 'express';
import { RequestContext } from './RequestContext';
import { z } from 'zod';

type Method = 'POST' | 'GET' | 'PATCH' | 'DELETE';

type Handler<T = unknown, TR = unknown> = {
  parse: (req: Request) => T | Promise<T>;
  handler: (data: T, context: RequestContext) => Promise<TR> | TR;
  validator?: z.ZodType<T>;
};

type IControllerConstructor<TPath extends string, Handler> = Partial<
  Record<`${Method} /${TPath}${string}`, Handler>
>;

export class Controller<TPath extends string> {
  data: IControllerConstructor<TPath, Handler>;

  constructor(data: IControllerConstructor<TPath, Handler>) {
    this.data = data;
  }

  static handler<T, TR>(arg: Handler<T, TR>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return arg as Handler<any, TR>;
  }
}
