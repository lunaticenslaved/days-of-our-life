import { ComponentProps } from 'react';

import { FormDialogComponent, FormValues } from './Form.component';
import { CosmeticBenefit } from '#/shared/models/cosmetic';
import {
  useCreateCosmeticBenefitMutation,
  useUpdateCosmeticBenefitMutation,
} from '#/client/entities/cosmetic/benefits/queries';
import { Handlers } from '#/client/types';

export {
  type FormValues as CosmeticBenefitFormValues,
  FormDialogComponent as CosmeticBenefitFormDialog,
};

type CosmeticBenefitFormDialogProps = ComponentProps<typeof FormDialogComponent>;
type CosmeticBenefitFormDialogContainerProps = Pick<
  CosmeticBenefitFormDialogProps,
  'disabled' | 'loading' | 'benefitId' | 'initialValues' | 'onSubmit'
>;

export function useCosmeticBenefitFormDialogContainer(
  arg:
    | {
        type: 'update';
        benefit: CosmeticBenefit;
        handlers: Handlers<CosmeticBenefit>;
      }
    | {
        type: 'create';
        handlers: Handlers<CosmeticBenefit>;
        parentId?: string;
      },
): CosmeticBenefitFormDialogContainerProps {
  const updating = useUpdating(arg);
  const creating = useCreating(arg);

  if (arg.type === 'update') {
    return updating;
  }

  return creating;
}

function useUpdating(arg: {
  benefit?: CosmeticBenefit;
  handlers: Handlers<CosmeticBenefit>;
}): CosmeticBenefitFormDialogContainerProps {
  const updating = useUpdateCosmeticBenefitMutation(arg.benefit?.id || '', arg.handlers);

  return {
    loading: updating.isPending,
    disabled: updating.isPending,
    benefitId: arg.benefit?.id,
    initialValues: {
      name: arg.benefit?.name || '',
      parentId: arg.benefit?.parentId || '',
    },
    onSubmit: async (values: FormValues) => {
      if (arg.benefit) {
        return await updating.mutateAsync({
          newData: values,
          oldItem: arg.benefit,
        });
      }

      throw new Error('Updating benefit is not possible');
    },
  };
}

function useCreating(arg: {
  parentId?: string;
  handlers: Handlers<CosmeticBenefit>;
}): CosmeticBenefitFormDialogContainerProps {
  const creating = useCreateCosmeticBenefitMutation(arg.handlers);

  return {
    loading: creating.isPending,
    disabled: creating.isPending,
    initialValues: {
      name: '',
      parentId: arg.parentId || '',
    },
    onSubmit: values => {
      return creating.mutateAsync(values);
    },
  };
}
