import { Note } from '#/shared/models/notes';

export type CreateRequest = Pick<Note, 'linkedTo' | 'text'>;
export type CreateResponse = Note;
