export interface Handlers<T> {
  onError?(error: Error): void;
  onSuccess?(data: T): void;
}

export interface ClassNameProp {
  className?: string;
}

export type Direction = 'row' | 'column';

export interface DirectionProp {
  direction?: Direction;
}

export interface ModelValueProps<T = unknown> {
  modelValue?: T;
  onModelValueChange?(value?: T): void;
}

export interface MutationHandlers<TSuccessData = undefined> {
  onMutate?(): void;
  onError?(): void;
  onSuccess?: TSuccessData extends undefined ? () => void : (data: TSuccessData) => void;
}
