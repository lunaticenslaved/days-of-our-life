import { FormIngredient, FormPhase } from './schema';

export type IngredientData = {
  type: 'INGREDIENT';
  ingredient: FormIngredient;
  fieldName: string;
  phaseId: string;
};

export type PhaseData = {
  type: 'PHASE';
  index: number;
  phase: FormPhase;
  fieldName: string;
};

export type DraggingData = IngredientData | PhaseData;
