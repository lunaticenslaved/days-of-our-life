import { FormValues } from './schema';
import { FoodRecipe } from '#/shared/models/food';

export function getInitialValues(recipe?: FoodRecipe): FormValues {
  const parts: FormValues['parts'] = [];

  for (const part of recipe?.parts || []) {
    parts.push({
      title: part.title,
      description: part.description || '',
      ingredients: part.ingredients.map(i => ({
        grams: i.grams,
        productId: i.product.id,
        description: i.description || '',
      })),
    });
  }

  if (parts.length === 0) {
    parts.push({
      title: 'Основная',
      description: '-',
      ingredients: [],
    });
  }

  return {
    parts,
    output: recipe?.output || {
      grams: 0,
      servings: 0,
    },
    description: recipe?.description || '',
    name: recipe?.name || '',
  };
}
