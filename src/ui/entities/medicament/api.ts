import { MedicamentsSchema } from '#/shared/api/schemas/medicament';
import {
  CreateMedicamentRequest,
  CreateMedicamentResponse,
} from '#/shared/api/types/medicaments';
import { Handlers } from '#/ui/types';
import { wrapApiAction } from '#/ui/utils/api';
import { DefaultError, useMutation } from '@tanstack/react-query';

export function useCreateMedicamentMutation(handlers: Handlers<unknown> = {}) {
  return useMutation<
    CreateMedicamentRequest,
    DefaultError,
    CreateMedicamentResponse,
    CreateMedicamentResponse
  >({
    mutationKey: [`MedicamentsSchema.create`],
    mutationFn: wrapApiAction<CreateMedicamentRequest, CreateMedicamentResponse>(
      MedicamentsSchema.create,
      handlers,
    ),
  });
}
