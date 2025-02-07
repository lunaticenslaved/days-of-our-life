import { convertFoodProduct, SELECT_PRODUCT } from '#/server/selectors/food';
import FoodQuantityConverterService from '#/server/services/food/FoodQuantityConverterService';
import { Controller } from '#/server/utils/Controller';
import {
  CreateFoodProductRequest,
  CreateFoodProductResponse,
  DeleteFoodProductRequest,
  DeleteFoodProductResponse,
  GetFoodProductRequest,
  GetFoodProductResponse,
  ListFoodProductsRequest,
  ListFoodProductsResponse,
  UpdateFoodProductRequest,
  UpdateFoodProductResponse,
} from '#/shared/api/types/food';
import { CommonValidators } from '#/shared/models/common';

import { FoodValidators } from '#/shared/models/food';
import { z } from 'zod';

const CreateFoodProductRequestValidator: z.ZodType<CreateFoodProductRequest> = z.object({
  name: FoodValidators.name,
  manufacturer: FoodValidators.manufacturer,
  nutrientsPerGram: FoodValidators.nutrients,
});

const UpdateFoodProductRequestValidator: z.ZodType<UpdateFoodProductRequest> =
  CreateFoodProductRequestValidator.and(z.object({ id: CommonValidators.id }));

export default new Controller<'food/products'>({
  'POST /food/products': Controller.handler<
    CreateFoodProductRequest,
    CreateFoodProductResponse
  >({
    validator: CreateFoodProductRequestValidator,
    parse: req => req.body,
    handler: async ({ nutrientsPerGram, ...data }, { prisma }) => {
      return await prisma.$transaction(async trx => {
        const product = await trx.foodProduct
          .create({
            data: {
              name: data.name,
              manufacturer: data.manufacturer,
              nutrientsPerGram: {
                create: nutrientsPerGram,
              },
            },
            ...SELECT_PRODUCT,
          })
          .then(convertFoodProduct);

        await FoodQuantityConverterService.insert({ productId: product.id }, trx);

        return product;
      });
    },
  }),

  'PATCH /food/products/:productId': Controller.handler<
    UpdateFoodProductRequest,
    UpdateFoodProductResponse
  >({
    validator: UpdateFoodProductRequestValidator,
    parse: req => ({ id: req.params.productId, ...req.body }),
    handler: async ({ id, nutrientsPerGram, ...data }, { prisma }) => {
      return await prisma.$transaction(async trx => {
        const product = await trx.foodProduct
          .update({
            where: { id },
            data: {
              name: data.name,
              manufacturer: data.manufacturer,
              nutrientsPerGram: {
                upsert: {
                  create: nutrientsPerGram,
                  update: nutrientsPerGram,
                },
              },
            },
            ...SELECT_PRODUCT,
          })
          .then(convertFoodProduct);

        await FoodQuantityConverterService.insert({ productId: product.id }, trx);

        return product;
      });
    },
  }),

  'DELETE /food/products/:productId': Controller.handler<
    DeleteFoodProductRequest,
    DeleteFoodProductResponse
  >({
    validator: z.object({ id: CommonValidators.id }),
    parse: req => ({ id: req.params.productId }),
    handler: async ({ id }, { prisma }) => {
      await prisma.foodProduct.deleteMany({
        where: { id },
      });
    },
  }),

  'GET /food/products': Controller.handler<
    ListFoodProductsRequest,
    ListFoodProductsResponse
  >({
    validator: z.object({}),
    parse: () => ({}),
    handler: async (_, { prisma }) => {
      return await prisma.foodProduct
        .findMany(SELECT_PRODUCT)
        .then(d => d.map(convertFoodProduct));
    },
  }),

  'GET /food/products/:productId': Controller.handler<
    GetFoodProductRequest,
    GetFoodProductResponse
  >({
    validator: z.object({ id: CommonValidators.id }),
    parse: req => ({ id: req.params.productId }),
    handler: async ({ id }, { prisma }) => {
      return await prisma.foodProduct
        .findFirstOrThrow({
          where: { id },
          ...SELECT_PRODUCT,
        })
        .then(convertFoodProduct);
    },
  }),
});
