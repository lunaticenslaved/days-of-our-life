import { CommonValidators } from '../common';
import { DateFormat } from '#/shared/models/date';
import { orderBy } from 'lodash';
import { z } from 'zod';
import { ERROR_MESSAGES } from '#/shared/validation';

export * from './homemade';
export * from './applications';

export interface CosmeticProduct {
  id: string;
  name: string;
  manufacturer: string;
}

export interface CosmeticProductApplication {
  id: string;
  date: DateFormat;
  dayPartId: string;
  cosmeticProductId: string;
}

export interface CosmeticBenefit {
  id: string;
  name: string;
  parentId?: string;
}

export interface CosmeticBenefitTree {
  id: string;
  name: string;
  parentId?: string;
  children: CosmeticBenefitTree[];
}

export const CosmeticUtils = {
  treeBenefits(benefits: CosmeticBenefit[]): Array<CosmeticBenefitTree> {
    const result: Array<CosmeticBenefitTree> = [];

    const map: Record<string, CosmeticBenefitTree> = {};

    for (const benefit of benefits) {
      map[benefit.id] = {
        ...benefit,
        children: [],
      };
    }

    for (const benefit of benefits) {
      if (benefit.parentId) {
        map[benefit.parentId].children.push(map[benefit.id]);
      }
    }

    for (const item of Object.values(map)) {
      if (!item.parentId) {
        result.push(item);
      }
    }

    return result;
  },
  orderBenefits<T extends Pick<CosmeticBenefit, 'name'>>(benefits: T[]): T[] {
    return orderBy(benefits, benefit => benefit.name, 'asc');
  },
  checkIngredientsPercents(recipe: Pick<CosmeticRecipe, 'phases'>) {
    let sum = 0;

    for (const phase of recipe.phases) {
      for (const ingredient of phase.ingredients) {
        sum += ingredient.percent || 0;
      }
    }

    if (sum !== 100) {
      throw new Error('Сумма процентов должна быть равна 100');
    }
  },
};

/* ==================================================================== */
/* ================== Cosmetic Ingredient ============================= */
/* ==================================================================== */
export interface CosmeticIngredient {
  id: string;
  name: string;
  description: string | null;
  benefitIds: string[];
  INCIIngredientIds: string[];
  storage: {
    grams: number;
  };
}

export const CosmeticIngredientValidators = (() => {
  return {
    name: CommonValidators.str(255),
    description: z.string().max(1000, ERROR_MESSAGES.maxLengthStr(1000)).optional(),
    INCIIngredientIds: z.array(CommonValidators.id),
    benefitIds: z.array(CommonValidators.id),
  };
})();

/* ==================================================================== */
/* ================== Cosmetic Recipe ================================= */
/* ==================================================================== */
export interface CosmeticRecipe {
  id: string;
  name: string;
  description: string | null;
  phases: Array<{
    ingredients: Array<{
      ingredientId: string;
      percent: number;
      comment: string | null;
    }>;
  }>;
}

export const CosmeticRecipeValidators = (() => {
  const ingredientId = CommonValidators.id;
  const ingredientPercent = CommonValidators.number({ min: 0, max: 100 });
  const ingredientComment = CommonValidators.strNullable(255);
  const ingredient = z.object({
    ingredientId,
    comment: ingredientComment,
    percent: ingredientPercent,
  });

  const phaseName = CommonValidators.str(255);
  const phaseIngredients = z.array(ingredient).min(1, ERROR_MESSAGES.required);
  const phase = z.object({
    ingredients: phaseIngredients,
  });

  return {
    id: CommonValidators.id,
    name: CommonValidators.str(255),
    description: CommonValidators.strNullable(1000),

    phaseName,
    phaseIngredients,
    phases: z.array(phase).min(1, ERROR_MESSAGES.required),

    ingredientId,
    ingredientPercent,
    ingredientComment,
    ingredient,
  };
})();

/* ==================================================================== */
/* ================== Cosmetic Recipe Comment ========================= */
/* ==================================================================== */
export interface CosmeticRecipeComment {
  id: string;
  text: string;
  createdAt: string; // FIXME datetime format
}

export const CosmeticRecipeCommentValidators = (() => {
  return {
    text: CommonValidators.str(1000),
  };
})();

/* ==================================================================== */
/* ================== Cosmetic INCI Ingredient ======================== */
/* ==================================================================== */
export interface CosmeticINCIIngredient {
  id: string;
  name: string;
  benefitIds: string[];
}

export const CosmeticINCIIngredientValidators = (() => {
  return {
    name: CommonValidators.str(255),
    benefitIds: z.array(CommonValidators.id),
  };
})();
