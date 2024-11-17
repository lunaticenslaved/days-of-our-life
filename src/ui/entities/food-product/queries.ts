import { FoodSchema } from '#shared/api/schemas/food';
import { FoodProduct } from '#shared/models/food';
import { wrapApiAction } from '#ui/utils/api';
import { Handlers } from '#ui/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useListFoodProductsQuery() {
  return useQuery({
    queryKey: ['FoodSchema.products.list'],
    queryFn: wrapApiAction(FoodSchema.products.list),
  });
}

export function useGetFoodProductQuery(productId: string) {
  return useQuery({
    queryKey: [`FoodSchema.products.get(${productId})`],
    queryFn: () => wrapApiAction(FoodSchema.products.get)({ id: productId }),
  });
}

export function useCreateFoodProductMutation(handlers: Handlers<FoodProduct> = {}) {
  return useMutation({
    mutationKey: [`FoodSchema.products.create`],
    mutationFn: wrapApiAction(FoodSchema.products.create, handlers),
  });
}

export function useUpdateFoodProductMutation(
  productId: string,
  handlers: Handlers<FoodProduct> = {},
) {
  return useMutation({
    mutationKey: [`FoodSchema.products.update(${productId})`],
    mutationFn: wrapApiAction(FoodSchema.products.update, handlers, { id: productId }),
  });
}

export function useDeleteFoodProductMutation(
  productId: string = '',
  handlers: Handlers<unknown> = {},
) {
  return useMutation({
    mutationKey: [`FoodSchema.products.delete(${productId})`],
    mutationFn: wrapApiAction(FoodSchema.products.delete, handlers, { id: productId }),
  });
}
