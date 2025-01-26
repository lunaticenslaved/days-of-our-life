import { CosmeticRecipeComment } from '#/shared/models/cosmetic';
import dayjs from 'dayjs';
import { orderBy } from 'lodash';
import { ReactNode, useMemo } from 'react';

interface CosmeticRecipeCommentListProps {
  comments: CosmeticRecipeComment[];
  renderActions?(comment: CosmeticRecipeComment): ReactNode;
}

export function CosmeticRecipeCommentList({
  comments,
  renderActions,
}: CosmeticRecipeCommentListProps) {
  const sortedComments = useMemo(() => {
    return orderBy(comments, comment => dayjs(comment.createdAt).valueOf(), 'desc'); // FIXME wrap datetime in utils
  }, [comments]);

  return (
    <ul style={{ minWidth: '400px' }}>
      {sortedComments.map(comment => {
        return (
          <li key={comment.id}>
            <p>{comment.text}</p>
            <span>{comment.createdAt}</span>
            {!!renderActions && renderActions?.(comment)}
          </li>
        );
      })}
    </ul>
  );
}
