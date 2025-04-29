import { Schema } from '#/shared/api/schemas';
import { MutationHandlers } from '#/client/types';
import { queryClient, wrapApiAction } from '#/client/utils/api';
import {
  DefaultError,
  MutationKey,
  QueryKey,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {
  CreateCosmeticBenefitRequest,
  CreateCosmeticBenefitResponse,
  CreateCosmeticRecipeCommentRequest,
  CreateCosmeticRecipeCommentResponse,
  DeleteCosmeticBenefitRequest,
  DeleteCosmeticBenefitResponse,
  DeleteCosmeticRecipeCommentRequest,
  DeleteCosmeticRecipeCommentResponse,
  GetCosmeticBenefitResponse,
  GetCosmeticRecipeCommentResponse,
  ListCosmeticBenefitsResponse,
  ListCosmeticRecipeCommentsResponse,
  UpdateCosmeticBenefitRequest,
  UpdateCosmeticBenefitResponse,
  UpdateCosmeticRecipeCommentRequest,
  UpdateCosmeticRecipeCommentResponse,
} from '#/shared/api/types/cosmetic';
import { CosmeticBenefit, CosmeticRecipeComment } from '#/shared/models/cosmetic';
import { orderBy } from 'lodash';
import dayjs from '#/shared/libs/dayjs';

const StoreKeys = {
  // Cosmetic Benefits
  getCosmeticBenefit: (benefitId: string): QueryKey => [
    'cosmetic',
    'benefits',
    benefitId,
  ],
  listCosmeticBenefits: (): QueryKey => ['cosmetic', 'benefits'],
  createCosmeticBenefit: (): MutationKey => ['cosmetic', 'benefits', 'create'],
  deleteCosmeticBenefit: (): MutationKey => ['cosmetic', 'benefits', 'delete'],
  updateCosmeticBenefit: (): MutationKey => ['cosmetic', 'benefits', 'update'],

  // Cosmetic Recipe Comments
  getCosmeticRecipeComment: ({
    recipeId,
    commentId,
  }: {
    commentId: string;
    recipeId: string;
  }): QueryKey => ['cosmetic', 'recipes', recipeId, 'comments', commentId],
  listCosmeticRecipeComments: ({ recipeId }: { recipeId: string }): QueryKey => [
    'cosmetic',
    'recipes',
    recipeId,
    'comments',
  ],
  createCosmeticRecipeComment: (): MutationKey => ['cosmetic', 'recipes', 'create'],
  deleteCosmeticRecipeComment: (): MutationKey => ['cosmetic', 'recipes', 'delete'],
  updateCosmeticRecipeComment: (): MutationKey => ['cosmetic', 'recipes', 'update'],
};

// Cosmetic Benefits
export function useCreateCosmeticBenefitMutation(
  handlers: MutationHandlers<CosmeticBenefit> = {},
) {
  return useMutation<
    CreateCosmeticBenefitResponse,
    DefaultError,
    CreateCosmeticBenefitRequest,
    {
      createdItem: CosmeticBenefit;
    }
  >({
    mutationKey: StoreKeys.createCosmeticBenefit(),
    mutationFn: wrapApiAction<
      CreateCosmeticBenefitRequest,
      CreateCosmeticBenefitResponse
    >(Schema.cosmetic.createCosmeticBenefit),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticBenefits(),
      });

      const createdItem: CosmeticBenefit = {
        id: Date.now().toString(),
        name: request.name,
        parentId: request.parentId,
      };

      updateCosmeticBenefitsQueries({
        addCosmeticBenefit: createdItem,
      });

      handlers.onMutate?.();

      return {
        createdItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticBenefitsQueries({
          removeCosmeticBenefitById: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      updateCosmeticBenefitsQueries({
        removeCosmeticBenefitById: context?.createdItem.id,
        addCosmeticBenefit: response,
      });

      return response;
    },
  });
}

export function useDeleteCosmeticBenefitMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    DeleteCosmeticBenefitResponse,
    DefaultError,
    CosmeticBenefit,
    {
      deletedItem?: CosmeticBenefit;
    }
  >({
    mutationKey: StoreKeys.deleteCosmeticBenefit(),
    mutationFn: data =>
      wrapApiAction<DeleteCosmeticBenefitRequest, DeleteCosmeticBenefitResponse>(
        Schema.cosmetic.deleteCosmeticBenefit,
      )({ id: data.id }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listCosmeticBenefits() });

      const deletedItem = request;

      updateCosmeticBenefitsQueries({
        removeCosmeticBenefitById: request.id,
      });

      handlers.onMutate?.();

      return {
        deletedItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticBenefitsQueries({
          addCosmeticBenefit: context.deletedItem,
        });
      }
    },
  });
}

export function useUpdateCosmeticBenefitMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    UpdateCosmeticBenefitResponse,
    DefaultError,
    {
      oldItem: CosmeticBenefit;
      newData: Omit<UpdateCosmeticBenefitRequest, 'id'>;
    },
    {
      oldItem: CosmeticBenefit;
      newItem: CosmeticBenefit;
    }
  >({
    mutationKey: StoreKeys.updateCosmeticBenefit(),
    mutationFn: data =>
      wrapApiAction<UpdateCosmeticBenefitRequest, UpdateCosmeticBenefitResponse>(
        Schema.cosmetic.updateCosmeticBenefit,
      )({ id: data.oldItem.id, ...data.newData }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listCosmeticBenefits() });

      const newItem: CosmeticBenefit = {
        id: request.oldItem.id,
        ...request.newData,
      };

      updateCosmeticBenefitsQueries({
        removeCosmeticBenefitById: request.oldItem.id,
        addCosmeticBenefit: newItem,
      });

      handlers.onMutate?.();

      return {
        newItem,
        oldItem: request.oldItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticBenefitsQueries({
          removeCosmeticBenefitById: context.newItem.id,
          addCosmeticBenefit: context.oldItem,
        });
      }
    },
  });
}

export function useGetCosmeticBenefitQuery(benefitId: string) {
  return useQuery<GetCosmeticBenefitResponse, Error, GetCosmeticBenefitResponse>({
    queryKey: StoreKeys.getCosmeticBenefit(benefitId),
    queryFn: () => wrapApiAction(Schema.cosmetic.getCosmeticBenefit)({ id: benefitId }),
  });
}

export function useListCosmeticBenefitsQuery(enabled = true) {
  return useQuery<ListCosmeticBenefitsResponse, Error, ListCosmeticBenefitsResponse>({
    queryKey: StoreKeys.listCosmeticBenefits(),
    queryFn: wrapApiAction(Schema.cosmetic.listCosmeticBenefits),
    select: data => {
      return orderBy(data, item => item.name, 'asc');
    },
    enabled,
  });
}

function updateCosmeticBenefitsQueries(arg: {
  addCosmeticBenefit?: CosmeticBenefit;
  removeCosmeticBenefitById?: string;
}) {
  if (arg.removeCosmeticBenefitById) {
    queryClient.removeQueries({
      queryKey: StoreKeys.getCosmeticBenefit(arg.removeCosmeticBenefitById),
    });
  }

  if (arg.addCosmeticBenefit) {
    queryClient.setQueryData(
      StoreKeys.getCosmeticBenefit(arg.addCosmeticBenefit.id),
      arg.addCosmeticBenefit,
    );
  }

  queryClient.setQueryData<ListCosmeticBenefitsResponse>(
    StoreKeys.listCosmeticBenefits(),
    _old => {
      if (!_old) {
        return _old;
      }

      let old = [..._old];

      if (arg.removeCosmeticBenefitById) {
        old = old.filter(item => item.id !== arg.removeCosmeticBenefitById);
      }

      if (arg.addCosmeticBenefit) {
        old.push(arg.addCosmeticBenefit);
      }

      return old;
    },
  );
}

/* =============== Cosmetic Recipe Comment =============== */
export function useCreateCosmeticRecipeCommentMutation(
  recipeId: string,
  handlers: MutationHandlers<CosmeticRecipeComment> = {},
) {
  return useMutation<
    CreateCosmeticRecipeCommentResponse,
    DefaultError,
    Omit<CreateCosmeticRecipeCommentRequest, 'recipeId'>,
    {
      createdItem: CosmeticRecipeComment;
    }
  >({
    mutationKey: StoreKeys.createCosmeticRecipeComment(),
    mutationFn: data =>
      wrapApiAction<
        CreateCosmeticRecipeCommentRequest,
        CreateCosmeticRecipeCommentResponse
      >(Schema.cosmetic.createCosmeticRecipeComment)({ recipeId, ...data }),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticRecipeComments({ recipeId }),
      });

      const createdItem: CosmeticRecipeComment = {
        id: Date.now().toString(),
        text: request.text,
        createdAt: new Date().toISOString(),
      };

      updateCosmeticRecipeCommentsQueries({
        recipeId,
        addCosmeticRecipeComment: createdItem,
      });

      handlers.onMutate?.();

      return {
        createdItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticRecipeCommentsQueries({
          recipeId,
          removeCosmeticRecipeCommentById: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      updateCosmeticRecipeCommentsQueries({
        recipeId,
        removeCosmeticRecipeCommentById: context?.createdItem.id,
        addCosmeticRecipeComment: response,
      });

      return response;
    },
  });
}

export function useDeleteCosmeticRecipeCommentMutation(
  recipeId: string,
  handlers: MutationHandlers = {},
) {
  return useMutation<
    DeleteCosmeticRecipeCommentResponse,
    DefaultError,
    CosmeticRecipeComment,
    {
      deletedItem?: CosmeticRecipeComment;
    }
  >({
    mutationKey: StoreKeys.deleteCosmeticRecipeComment(),
    mutationFn: data =>
      wrapApiAction<
        DeleteCosmeticRecipeCommentRequest,
        DeleteCosmeticRecipeCommentResponse
      >(Schema.cosmetic.deleteCosmeticRecipeComment)({
        id: data.id,
        recipeId,
      }),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticRecipeComments({ recipeId }),
      });

      const deletedItem = request;

      updateCosmeticRecipeCommentsQueries({
        recipeId,
        removeCosmeticRecipeCommentById: request.id,
      });

      handlers.onMutate?.();

      return {
        deletedItem,
      };
    },
    onSuccess: () => {
      handlers.onSuccess?.();
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticRecipeCommentsQueries({
          recipeId,
          addCosmeticRecipeComment: context.deletedItem,
        });
      }
    },
  });
}

export function useUpdateCosmeticRecipeCommentMutation(
  recipeId: string,
  handlers: MutationHandlers = {},
) {
  return useMutation<
    UpdateCosmeticRecipeCommentResponse,
    DefaultError,
    {
      oldItem: CosmeticRecipeComment;
      newData: Omit<UpdateCosmeticRecipeCommentRequest, 'id' | 'recipeId'>;
    },
    {
      oldItem: CosmeticRecipeComment;
      newItem: CosmeticRecipeComment;
    }
  >({
    mutationKey: StoreKeys.updateCosmeticRecipeComment(),
    mutationFn: data =>
      wrapApiAction<
        UpdateCosmeticRecipeCommentRequest,
        UpdateCosmeticRecipeCommentResponse
      >(Schema.cosmetic.updateCosmeticRecipeComment)({
        id: data.oldItem.id,
        recipeId,
        ...data.newData,
      }),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticRecipeComments({
          recipeId,
        }),
      });
      await queryClient.cancelQueries({
        queryKey: StoreKeys.getCosmeticRecipeComment({
          recipeId,
          commentId: request.oldItem.id,
        }),
      });

      const newItem: CosmeticRecipeComment = {
        id: request.oldItem.id,
        text: request.newData.text,
        createdAt: request.oldItem.createdAt,
      };

      updateCosmeticRecipeCommentsQueries({
        recipeId,
        removeCosmeticRecipeCommentById: request.oldItem.id,
        addCosmeticRecipeComment: newItem,
      });

      handlers.onMutate?.();

      return {
        newItem,
        oldItem: request.oldItem,
      };
    },
    onSuccess: response => {
      updateCosmeticRecipeCommentsQueries({
        recipeId,
        removeCosmeticRecipeCommentById: response.id,
        addCosmeticRecipeComment: response,
      });
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticRecipeCommentsQueries({
          recipeId,
          removeCosmeticRecipeCommentById: context.newItem.id,
          addCosmeticRecipeComment: context.oldItem,
        });
      }
    },
  });
}

export function useGetCosmeticRecipeCommentQuery({
  recipeId,
  commentId,
}: {
  recipeId: string;
  commentId: string;
}) {
  return useQuery<
    GetCosmeticRecipeCommentResponse,
    Error,
    GetCosmeticRecipeCommentResponse
  >({
    queryKey: StoreKeys.getCosmeticRecipeComment({
      recipeId,
      commentId,
    }),
    queryFn: () =>
      wrapApiAction(Schema.cosmetic.getCosmeticRecipeComment)({
        id: commentId,
        recipeId,
      }),
  });
}

export function useListCosmeticRecipeCommentsQuery(recipeId: string, enabled = true) {
  return useQuery<
    ListCosmeticRecipeCommentsResponse,
    Error,
    ListCosmeticRecipeCommentsResponse
  >({
    queryKey: StoreKeys.listCosmeticRecipeComments({ recipeId }),
    queryFn: () =>
      wrapApiAction(Schema.cosmetic.listCosmeticRecipeComments)({ recipeId }),
    select: data => {
      return orderBy(data, item => dayjs(item.createdAt), 'asc'); // FIXME wrap dayjs in datetime utils
    },
    enabled,
  });
}

function updateCosmeticRecipeCommentsQueries({
  recipeId,
  ...arg
}: {
  recipeId: string;
  addCosmeticRecipeComment?: CosmeticRecipeComment;
  removeCosmeticRecipeCommentById?: string;
}) {
  if (
    arg.removeCosmeticRecipeCommentById &&
    arg.addCosmeticRecipeComment?.id !== arg.removeCosmeticRecipeCommentById
  ) {
    queryClient.removeQueries({
      queryKey: StoreKeys.getCosmeticRecipeComment({
        recipeId,
        commentId: arg.removeCosmeticRecipeCommentById,
      }),
    });
  }

  if (arg.addCosmeticRecipeComment) {
    queryClient.setQueryData<GetCosmeticRecipeCommentResponse>(
      StoreKeys.getCosmeticRecipeComment({
        recipeId,
        commentId: arg.addCosmeticRecipeComment.id,
      }),
      () => {
        return arg.addCosmeticRecipeComment;
      },
    );
  }

  queryClient.setQueryData<ListCosmeticRecipeCommentsResponse>(
    StoreKeys.listCosmeticRecipeComments({ recipeId }),
    _old => {
      if (!_old) {
        return _old;
      }

      let old = [..._old];

      if (arg.removeCosmeticRecipeCommentById) {
        old = old.filter(item => item.id !== arg.removeCosmeticRecipeCommentById);
      }

      if (arg.addCosmeticRecipeComment) {
        old.push(arg.addCosmeticRecipeComment);
      }

      return old;
    },
  );
}
