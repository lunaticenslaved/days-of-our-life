import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { CosmeticIngredientStorageForm } from '#/client/entities/cosmetic/ingredient-storage';
import { CosmeticIngredient } from '#/shared/models/cosmetic';
import { Box, Button, Flex, Popup, usePopup } from '#/ui-lib/components';
import { ComponentProps } from 'react';

type Actions = 'edit' | 'delete';

const ActionsComponentBase = createEntityActions<CosmeticIngredient, Actions>({
  entityName: 'CosmeticIngredient',
  actions: {
    edit: EntityActionsTemplate.edit,
    delete: EntityActionsTemplate.delete,
  },
  getActions() {
    return ['edit', 'delete'];
  },
});

type ActionsComponentProps = ComponentProps<typeof ActionsComponentBase>;

export function ActionsComponent(props: ActionsComponentProps) {
  const popup = usePopup();

  return (
    <Flex gap={2}>
      <Popup popup={popup}>
        <Popup.Trigger>
          <Button view="toned">В наличии: {props.entity.storage.grams} грамм</Button>
        </Popup.Trigger>
        <Popup.Content>
          <Box color="background" spacing={{ p: 4 }}>
            <CosmeticIngredientStorageForm
              ingredientId={props.entity.id}
              onSuccess={popup.close}
              autoFocus
            />
          </Box>
        </Popup.Content>
      </Popup>

      <ActionsComponentBase {...props} />
    </Flex>
  );
}
