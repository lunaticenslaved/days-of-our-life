import { Prisma } from '@prisma/client';
import { CosmeticProduct } from '#/shared/models/cosmetic';

export const COSMETIC_PRODUCT_SELECTOR = {
  select: {
    id: true,
    name: true,
    manufacturer: true,
  },
} satisfies Prisma.CosmeticProductDefaultArgs;

export function convertCosmeticProductSelector(
  data: Prisma.CosmeticProductGetPayload<typeof COSMETIC_PRODUCT_SELECTOR>,
): CosmeticProduct {
  return data;
}
