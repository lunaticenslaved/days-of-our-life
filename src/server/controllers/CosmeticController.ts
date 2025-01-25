import {
  convertCosmeticProductSelector,
  COSMETIC_PRODUCT_SELECTOR,
} from '#/server/selectors/cosmetic';
import {
  CreateCosmeticBenefitRequest,
  CreateCosmeticBenefitResponse,
  CreateCosmeticIngredientRequest,
  CreateCosmeticIngredientResponse,
  CreateCosmeticProductRequest,
  CreateCosmeticProductResponse,
  CreateCosmeticRecipeRequest,
  CreateCosmeticRecipeResponse,
  DeleteCosmeticBenefitRequest,
  DeleteCosmeticBenefitResponse,
  DeleteCosmeticIngredientRequest,
  DeleteCosmeticIngredientResponse,
  DeleteCosmeticProductRequest,
  DeleteCosmeticProductResponse,
  DeleteCosmeticRecipeRequest,
  DeleteCosmeticRecipeResponse,
  GetCosmeticBenefitRequest,
  GetCosmeticBenefitResponse,
  GetCosmeticIngredientRequest,
  GetCosmeticIngredientResponse,
  GetCosmeticProductRequest,
  GetCosmeticProductResponse,
  GetCosmeticRecipeRequest,
  GetCosmeticRecipeResponse,
  ListCosmeticBenefitsRequest,
  ListCosmeticBenefitsResponse,
  ListCosmeticIngredientsRequest,
  ListCosmeticIngredientsResponse,
  ListCosmeticProductsRequest,
  ListCosmeticProductsResponse,
  ListCosmeticRecipesRequest,
  ListCosmeticRecipesResponse,
  UpdateCosmeticBenefitRequest,
  UpdateCosmeticBenefitResponse,
  UpdateCosmeticIngredientRequest,
  UpdateCosmeticIngredientResponse,
  UpdateCosmeticProductRequest,
  UpdateCosmeticProductResponse,
  UpdateCosmeticRecipeRequest,
  UpdateCosmeticRecipeResponse,
} from '#/shared/api/types/cosmetic';
import { Controller } from '#/server/utils/Controller';

import { CommonValidators } from '#/shared/models/common';

import { z } from 'zod';
import CosmeticIngredientService from '#/server/services/CosmeticIngredientService';
import CosmeticBenefitService from '#/server/services/CosmeticBenefitService';
import CosmeticRecipeService from '#/server/services/CosmeticRecipeService';
import { CosmeticRecipeValidators } from '#/shared/models/cosmetic';

export default new Controller<'cosmetic'>({
  // Cosmetic Products
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

  // Cosmetic Ingredients
  'POST /cosmetic/ingredients': Controller.handler<
    CreateCosmeticIngredientRequest,
    CreateCosmeticIngredientResponse
  >({
    validator: z.object({
      name: CommonValidators.str(255),
      benefitIds: z.array(CommonValidators.id), // FIXME move to commob cosmetic validators
    }),
    parse: req => ({
      name: req.body.name,
      benefitIds: req.body.benefitIds,
    }),
    handler: async (data, { prisma }) => {
      return CosmeticIngredientService.create(data, prisma);
    },
  }),

  'PATCH /cosmetic/ingredients/:id': Controller.handler<
    UpdateCosmeticIngredientRequest,
    UpdateCosmeticIngredientResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
      name: CommonValidators.str(255),
      benefitIds: z.array(CommonValidators.id), // FIXME move to common cosmetic validators
    }),
    parse: req => ({
      id: req.params.id,
      name: req.body.name,
      benefitIds: req.body.benefitIds,
    }),
    handler: async ({ id, ...data }, { prisma }) => {
      return CosmeticIngredientService.update({ id, ...data }, prisma);
    },
  }),

  'DELETE /cosmetic/ingredients/:id': Controller.handler<
    DeleteCosmeticIngredientRequest,
    DeleteCosmeticIngredientResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
    }),
    parse: req => ({
      id: req.params.id,
    }),
    handler: async ({ id }, { prisma }) => {
      return CosmeticIngredientService.delete({ id }, prisma);
    },
  }),

  'GET /cosmetic/ingredients/:id': Controller.handler<
    GetCosmeticIngredientRequest,
    GetCosmeticIngredientResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
    }),
    parse: req => ({
      id: req.params.id,
    }),
    handler: async ({ id }, { prisma }) => {
      return CosmeticIngredientService.get({ id }, prisma);
    },
  }),

  'GET /cosmetic/ingredients': Controller.handler<
    ListCosmeticIngredientsRequest,
    ListCosmeticIngredientsResponse
  >({
    validator: z.object({}),
    parse: () => ({}),
    handler: async (_, { prisma }) => {
      return CosmeticIngredientService.list({}, prisma);
    },
  }),

  // // Cosmetic Benefits
  'POST /cosmetic/benefits': Controller.handler<
    CreateCosmeticBenefitRequest,
    CreateCosmeticBenefitResponse
  >({
    validator: z.object({
      name: CommonValidators.str(255),
      parentId: CommonValidators.id.optional(),
    }),
    parse: req => ({
      name: req.body.name,
      parentId: req.body.parentId,
    }),
    handler: async (data, { prisma }) => {
      return CosmeticBenefitService.create(data, prisma);
    },
  }),

  'PATCH /cosmetic/benefits/:id': Controller.handler<
    UpdateCosmeticBenefitRequest,
    UpdateCosmeticBenefitResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
      name: CommonValidators.str(255),
      parentId: CommonValidators.id.optional(),
    }),
    parse: req => ({
      id: req.params.id,
      name: req.body.name,
      parentId: req.body.parentId,
    }),
    handler: async (data, { prisma }) => {
      return CosmeticBenefitService.update(data, prisma);
    },
  }),

  'DELETE /cosmetic/benefits/:id': Controller.handler<
    DeleteCosmeticBenefitRequest,
    DeleteCosmeticBenefitResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
    }),
    parse: req => ({
      id: req.params.id,
    }),
    handler: async (data, { prisma }) => {
      return CosmeticBenefitService.delete(data, prisma);
    },
  }),

  'GET /cosmetic/benefits/:id': Controller.handler<
    GetCosmeticBenefitRequest,
    GetCosmeticBenefitResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
    }),
    parse: req => ({
      id: req.params.id,
    }),
    handler: async (data, { prisma }) => {
      return CosmeticBenefitService.get(data, prisma);
    },
  }),

  'GET /cosmetic/benefits': Controller.handler<
    ListCosmeticBenefitsRequest,
    ListCosmeticBenefitsResponse
  >({
    validator: z.object({}),
    parse: _req => ({}),
    handler: async (data, { prisma }) => {
      return CosmeticBenefitService.list(data, prisma);
    },
  }),

  /* =============== Cosmetic Recipe START =============== */
  'GET /cosmetic/recipes': Controller.handler<
    ListCosmeticRecipesRequest,
    ListCosmeticRecipesResponse
  >({
    validator: z.object({}),
    parse: _req => ({}),
    handler: async (data, { prisma }) => {
      return CosmeticRecipeService.list(data, prisma);
    },
  }),

  'GET /cosmetic/recipes/:id': Controller.handler<
    GetCosmeticRecipeRequest,
    GetCosmeticRecipeResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
    }),
    parse: req => ({
      id: req.params.id,
    }),
    handler: async (data, { prisma }) => {
      return CosmeticRecipeService.get(data, prisma);
    },
  }),

  'POST /cosmetic/recipes': Controller.handler<
    CreateCosmeticRecipeRequest,
    CreateCosmeticRecipeResponse
  >({
    validator: z.object({
      name: CosmeticRecipeValidators.name,
      description: CosmeticRecipeValidators.description,
      phases: CosmeticRecipeValidators.phases,
    }),
    parse: req => req.body,
    handler: async (data, { prisma }) => {
      return CosmeticRecipeService.create(data, prisma);
    },
  }),

  'PATCH /cosmetic/recipes/:id': Controller.handler<
    UpdateCosmeticRecipeRequest,
    UpdateCosmeticRecipeResponse
  >({
    validator: z.object({
      id: CosmeticRecipeValidators.id,
      name: CosmeticRecipeValidators.name,
      description: CosmeticRecipeValidators.description,
      phases: CosmeticRecipeValidators.phases,
    }),
    parse: req => ({
      ...req.body,
      id: req.params.id,
    }),
    handler: async (data, { prisma }) => {
      return CosmeticRecipeService.update(data, prisma);
    },
  }),

  'DELETE /cosmetic/recipes/:id': Controller.handler<
    DeleteCosmeticRecipeRequest,
    DeleteCosmeticRecipeResponse
  >({
    validator: z.object({
      id: CosmeticRecipeValidators.id,
    }),
    parse: req => ({ id: req.params.id }),
    handler: async (data, { prisma }) => {
      return CosmeticRecipeService.delete(data, prisma);
    },
  }),
  /* =============== Cosmetic Recipe END =============== */
});
