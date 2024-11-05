import { convertFoodProduct, SELECT_PRODUCT } from '#server/models/food';
import { Controller } from '#server/utils/Controller';
import { FoodProduct } from '#shared/models/FoodProduct';

interface ProductId {
  productId: string;
}

interface CreateRequest {
  name: string;
  manufacturer?: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

interface UpdateRequest extends CreateRequest, ProductId {}

export default new Controller<'food/products'>({
  'POST /food/products': Controller.handler<CreateRequest, FoodProduct>({
    parse: req => req.body,
    handler: async (data, { prisma }) => {
      return await prisma.foodProduct
        .create({ data, ...SELECT_PRODUCT })
        .then(convertFoodProduct);
    },
  }),

  'GET /food/products': Controller.handler({
    parse: () => ({}),
    handler: async (_, { prisma }) => {
      return await prisma.foodProduct.findMany({});
    },
  }),

  'GET /food/products/:productId': Controller.handler<ProductId, FoodProduct>({
    parse: req => ({ productId: req.params.productId }),
    handler: async ({ productId }, { prisma }) => {
      return await prisma.foodProduct
        .findFirstOrThrow({
          where: { id: productId },
          ...SELECT_PRODUCT,
        })
        .then(convertFoodProduct);
    },
  }),

  'PATCH /food/products/:productId': Controller.handler<UpdateRequest, FoodProduct>({
    parse: req => ({ productId: req.params.productId, ...req.body }),
    handler: async ({ productId, ...data }, { prisma }) => {
      return await prisma.foodProduct
        .update({
          where: { id: productId },
          data,
          ...SELECT_PRODUCT,
        })
        .then(convertFoodProduct);
    },
  }),

  'DELETE /food/products/:productId': Controller.handler<ProductId, void>({
    parse: req => ({ productId: req.params.productId }),
    handler: async ({ productId }, { prisma }) => {
      await prisma.foodProduct.update({
        where: { id: productId },
        data: { isDeleted: true },
      });
    },
  }),
});
