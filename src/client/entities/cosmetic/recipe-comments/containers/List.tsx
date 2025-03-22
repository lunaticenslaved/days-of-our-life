import { useListCosmeticRecipeCommentsQuery } from '#/client/store';
import { ListComponent } from '../components/List';

import { ActionsContainer } from './Actions';

type ListContainerProps = {
  recipeId: string;
};

export function ListContainer({ recipeId }: ListContainerProps) {
  const commentsQuery = useListCosmeticRecipeCommentsQuery(recipeId);

  return (
    <ListComponent
      entities={commentsQuery.data || []}
      renderActions={comment => {
        return (
          <ActionsContainer
            recipeId={recipeId}
            comment={comment}
            onDeleted={() => null}
          />
        );
      }}
    />
  );
}
