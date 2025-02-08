import { PrismaTransaction } from '#/server/prisma';
import {
  convertFoodRecipe,
  ONLY_NUTRIENTS_SELECT,
  SELECT_RECIPE,
} from '#/server/selectors/food';
import FoodQuantityConverterService from './FoodQuantityConverterService';
import {
  divideNutrients,
  FoodNutrients,
  FoodRecipe,
  FoodRecipeOutput,
  multiplyNutrients,
  sumNutrients,
} from '#/shared/models/food';
import { flatMap } from 'lodash';

interface CreateRecipeRequest {
  name: string;
  description: string;
  output: FoodRecipeOutput;
  parts: Array<{
    title: string;
    description?: string;
    ingredients: Array<{
      grams: number;
      productId: string;
      description?: string;
    }>;
  }>;
}

class FoodRecipesService {
  private async _calculateNutrients(
    parts: CreateRecipeRequest['parts'],
    trx: PrismaTransaction,
  ): Promise<FoodNutrients> {
    return await Promise.all(
      flatMap(parts, p => p.ingredients).map(({ productId, grams }) => {
        return trx.foodProduct
          .findFirstOrThrow({
            where: {
              id: productId,
            },
            select: {
              nutrientsPerGram: ONLY_NUTRIENTS_SELECT,
            },
          })
          .then(({ nutrientsPerGram }) => multiplyNutrients(nutrientsPerGram, grams));
      }),
    ).then(sumNutrients);
  }

  private async _insertParts(
    recipeId: string,
    { parts }: Pick<CreateRecipeRequest, 'parts'>,
    trx: PrismaTransaction,
  ) {
    await trx.foodRecipePart.deleteMany({ where: { recipeId } });

    for (const part of parts) {
      const { id: recipePartId } = await trx.foodRecipePart.create({
        data: {
          recipeId,
          title: part.title,
          description: part.description,
        },
      });

      for (const { grams, productId, description } of part.ingredients) {
        await trx.foodRecipeIngredient.create({
          data: { recipePartId, productId, grams, description },
        });
      }
    }
  }

  async create(data: CreateRecipeRequest, trx: PrismaTransaction): Promise<FoodRecipe> {
    const { name, description, output, parts } = data;

    const nutrients = await this._calculateNutrients(parts, trx);

    const { id: recipeId } = await trx.foodRecipe.create({
      data: {
        name,
        description,
        nutrientsPerGram: {
          create: divideNutrients(nutrients, output.grams),
        },
        output: {
          create: output,
        },
      },
      select: {
        id: true,
      },
    });

    await FoodQuantityConverterService.insert({ recipeId, ...output }, trx);

    await this._insertParts(recipeId, { parts }, trx);

    return await trx.foodRecipe
      .findFirstOrThrow({
        where: { id: recipeId },
        ...SELECT_RECIPE,
      })
      .then(convertFoodRecipe);
  }
}

export default new FoodRecipesService();
