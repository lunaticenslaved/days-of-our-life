export interface Handlers<T> {
  onError?(error: Error): void;
  onSuccess?(data: T): void;
}

export interface ClassNameProp {
  className?: string;
}
