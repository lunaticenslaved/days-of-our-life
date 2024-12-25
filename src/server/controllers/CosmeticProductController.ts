import {
  convertCosmeticProductSelector,
  COSMETIC_PRODUCT_SELECTOR,
} from '#/server/selectors/cosmetic';
import {
  CreateCosmeticProductRequest,
  CreateCosmeticProductResponse,
  DeleteCosmeticProductRequest,
  DeleteCosmeticProductResponse,
  GetCosmeticProductRequest,
  GetCosmeticProductResponse,
  ListCosmeticProductsRequest,
  ListCosmeticProductsResponse,
  UpdateCosmeticProductRequest,
  UpdateCosmeticProductResponse,
} from '#/shared/api/types/cosmetic';
import { Controller } from '#/server/utils/Controller';

import { CommonValidators } from '#/shared/models/common';

import { z } from 'zod';

export default new Controller<'cosmetic/products'>({
  'GET /cosmetic/products': Controller.handler<
    ListCosmeticProductsRequest,
    ListCosmeticProductsResponse
  >({
    validator: z.object({}),
    parse: _req => ({}),
    handler: async (_arg, { prisma }) => {
      return prisma.cosmeticProduct
        .findMany({
          ...COSMETIC_PRODUCT_SELECTOR,
        })
        .then(items => items.map(convertCosmeticProductSelector));
    },
  }),

  'GET /cosmetic/products/:productId': Controller.handler<
    GetCosmeticProductRequest,
    GetCosmeticProductResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
    }),
    parse: req => ({
      id: req.params.productId,
    }),
    handler: async ({ id }, { prisma }) => {
      return prisma.cosmeticProduct
        .findFirstOrThrow({
          where: { id },
          ...COSMETIC_PRODUCT_SELECTOR,
        })
        .then(convertCosmeticProductSelector);
    },
  }),

  'POST /cosmetic/products': Controller.handler<
    CreateCosmeticProductRequest,
    CreateCosmeticProductResponse
  >({
    validator: z.object({
      name: CommonValidators.str(255),
      manufacturer: CommonValidators.str(255),
    }),
    parse: req => ({
      name: req.body.name,
      manufacturer: req.body.manufacturer,
    }),
    handler: async (data, { prisma }) => {
      return prisma.cosmeticProduct
        .create({
          data: {
            name: data.name,
            manufacturer: data.manufacturer,
          },
          ...COSMETIC_PRODUCT_SELECTOR,
        })
        .then(convertCosmeticProductSelector);
    },
  }),

  'DELETE /cosmetic/products/:productId': Controller.handler<
    DeleteCosmeticProductRequest,
    DeleteCosmeticProductResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
    }),
    parse: req => ({
      id: req.params.productId,
    }),
    handler: async ({ id }, { prisma }) => {
      await prisma.cosmeticProduct.deleteMany({
        where: { id },
      });
    },
  }),

  'PATCH /cosmetic/products/:productId': Controller.handler<
    UpdateCosmeticProductRequest,
    UpdateCosmeticProductResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
      name: CommonValidators.str(255),
      manufacturer: CommonValidators.str(255),
    }),
    parse: req => ({
      id: req.params.productId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
    }),
    handler: async ({ id, ...data }, { prisma }) => {
      return prisma.cosmeticProduct
        .update({
          where: { id },
          data: {
            name: data.name,
            manufacturer: data.manufacturer,
          },
          ...COSMETIC_PRODUCT_SELECTOR,
        })
        .then(convertCosmeticProductSelector);
    },
  }),
});
