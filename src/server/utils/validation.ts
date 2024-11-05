import { ZodType } from 'zod';

export function createModelFieldValidator(zod: ZodType) {
  return (value: unknown) => {
    const { error } = zod.safeParse(value);

    if (error) {
      throw new Error(error.message);
    }

    return null;
  };
}
