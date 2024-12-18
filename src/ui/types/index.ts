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

export interface ModelValueProps<T> {
  modelValue?: T;
  onModelValueChange?(value?: T): void;
}
