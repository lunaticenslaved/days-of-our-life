import { Medicament } from '#/shared/models/medicament';

export function getMedicamentKeywords(medicament: Medicament): string[] {
  return [medicament.name];
}
