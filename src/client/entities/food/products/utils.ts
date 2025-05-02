import { FoodProduct } from '#/shared/models/food';
import _ from 'lodash';

export function orderFoodProducts<T extends Pick<FoodProduct, 'name'>>(
  products: T[],
): T[] {
  return _.orderBy(products, product => product.name.toLocaleLowerCase(), 'asc');
}
