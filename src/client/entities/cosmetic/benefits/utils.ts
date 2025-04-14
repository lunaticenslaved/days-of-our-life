import { CosmeticBenefit } from '#/shared/models/cosmetic';

export function getCosmeticBenefitKeywords(benefit: CosmeticBenefit): string[] {
  return [benefit.name];
}
