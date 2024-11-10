import _ from 'lodash';
import { ZodType } from 'zod';

export class Validator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private schema: ZodType<any, any, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(schema: ZodType<any, any, any>) {
    this.schema = schema;
  }

  validate = (values: unknown) => {
    const result = this.schema.safeParse(values);

    return result.error?.errors.reduce<Record<string, unknown>>((acc, error) => {
      _.set(acc, error.path, error.message);

      return acc;
    }, {});
  };
}
