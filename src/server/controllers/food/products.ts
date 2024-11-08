import { convertFoodProduct, SELECT_PRODUCT } from '#server/models/food';
import { Controller } from '#server/utils/Controller';
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
} from '#shared/api/types/food';

export default new Controller<'food/products'>({
  'POST /food/products': Controller.handler<
    CreateFoodProductRequest,
    CreateFoodProductResponse
  >({
    parse: req => req.body,
    handler: async ({ nutrients, ...data }, { prisma }) => {
      return await prisma.foodProduct
        .create({
          data: {
            name: data.name,
            manufacturer: data.manufacturer,
            nutrients: {
              create: nutrients,
            },
          },
          ...SELECT_PRODUCT,
        })
        .then(convertFoodProduct);
    },
  }),

  'PATCH /food/products/:productId': Controller.handler<
    UpdateFoodProductRequest,
    UpdateFoodProductResponse
  >({
    parse: req => ({ id: req.params.productId, ...req.body }),
    handler: async ({ id, nutrients, ...data }, { prisma }) => {
      return await prisma.foodProduct
        .update({
          where: { id },
          data: {
            name: data.name,
            manufacturer: data.manufacturer,
            nutrients: {
              update: nutrients,
            },
          },
          ...SELECT_PRODUCT,
        })
        .then(convertFoodProduct);
    },
  }),

  'DELETE /food/products/:productId': Controller.handler<
    DeleteFoodProductRequest,
    DeleteFoodProductResponse
  >({
    parse: req => ({ id: req.params.productId }),
    handler: async ({ id }, { prisma }) => {
      await prisma.foodProduct.update({
        where: { id },
        data: { isDeleted: true },
      });
    },
  }),

  'GET /food/products': Controller.handler<
    ListFoodProductsRequest,
    ListFoodProductsResponse
  >({
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
