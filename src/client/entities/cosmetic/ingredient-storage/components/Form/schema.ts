import { CommonValidators } from '#/shared/models/common';
import { z } from 'zod';

// TODO unify validator

export const schema = z.object({
  grams: CommonValidators.number({ min: 0 }),
});

export type FormValues = z.infer<typeof schema>;
