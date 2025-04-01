import { z } from 'zod';
import { CosmeticRecipeValidators } from '#/shared/models/cosmetic';
import { ERROR_MESSAGES } from '#/shared/validation';

export const schema = z.object({
  name: CosmeticRecipeValidators.name,
  description: CosmeticRecipeValidators.description,
  phases: z
    .array(
      z.object({
        id: z.string(),
        ingredients: z.array(
          z.object({
            id: z.string(),
            ingredientId: CosmeticRecipeValidators.ingredientId,
            percent: CosmeticRecipeValidators.ingredientPercent,
            comment: CosmeticRecipeValidators.ingredientComment,
          }),
        ),
        // FIXME если есть эта валидация, то при дгаре последнего элемента ловлю ошибку
        // Cannot set numeric property on an object
        // .min(1, ERROR_MESSAGES.required),
      }),
    )
    .min(1, ERROR_MESSAGES.required),
  // .refine(
  //   phases => {
  //     let sum = 0;

  //     for (const phase of phases) {
  //       for (const ingredient of phase.ingredients) {
  //         sum += ingredient?.percent || 0;
  //       }
  //     }

  //     return sum === 100;
  //   },
  //   {
  //     message: 'Сумма всех ингредиентов должна быть равна 100%',
  //   },
  // ),
});

export type FormValues = z.infer<typeof schema>;
export type FormPhase = FormValues['phases'][number];
export type FormIngredient = FormPhase['ingredients'][number];
