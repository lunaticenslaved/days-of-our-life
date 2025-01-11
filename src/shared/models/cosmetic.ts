import { DateFormat } from '#/shared/models/date';

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

export interface CosmeticIngredient {
  id: string;
  name: string;
}

export interface CosmeticIngredientBenefit {
  id: string;
  name: string;
  parentId?: string;
}

export interface CosmeticIngredientBenefitTree {
  id: string;
  name: string;
  parentId?: string;
  children: CosmeticIngredientBenefitTree[];
}

export const CosmeticUtils = {
  treeBenefits(
    benefits: CosmeticIngredientBenefit[],
  ): Array<CosmeticIngredientBenefitTree> {
    const result: Array<CosmeticIngredientBenefitTree> = [];

    const map: Record<string, CosmeticIngredientBenefitTree> = {};

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
};
