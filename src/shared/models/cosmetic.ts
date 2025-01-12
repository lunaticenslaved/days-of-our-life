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
  treeBenefits(
    benefits: CosmeticBenefit[],
  ): Array<CosmeticBenefitTree> {
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
};
