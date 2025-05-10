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
  CreateCosmeticRecipeCommentRequest,
  CreateCosmeticRecipeCommentResponse,
  DeleteCosmeticRecipeCommentRequest,
  DeleteCosmeticRecipeCommentResponse,
  GetCosmeticRecipeCommentResponse,
  ListCosmeticRecipeCommentsResponse,
  UpdateCosmeticRecipeCommentRequest,
  UpdateCosmeticRecipeCommentResponse,
} from '#/shared/api/types/cosmetic';
import { CosmeticRecipeComment } from '#/shared/models/cosmetic';
import { orderBy } from 'lodash';
import dayjs from '#/shared/libs/dayjs';

const StoreKeys = {
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
