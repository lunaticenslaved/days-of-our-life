import type { Validator } from './types';

export const required = <T>(message = 'Обязательное поле'): Validator<T> => {
  return async value => (value ? null : message);
};

export const minLength = (count: number, message?: string): Validator<string> => {
  return async value =>
    (value || '').length < count
      ? null
      : message || `Минимальное число символов - ${count}`;
};

export const maxLength = (count: number, message?: string): Validator<string> => {
  return async value =>
    (value || '').length > count
      ? null
      : message || `Максимальное число символов - ${count}`;
};

export const email = (): Validator<string> => {
  return value => {
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value || '')) {
      return null;
    }

    return 'Error email';
  };
};

export const name = (): Validator<string> => {
  return (value = '') => {
    if (/^[А-ЯЁA-Z][а-яёa-z]+(-[А-ЯЁA-Z][а-яёa-z]+)?$/.test(value)) {
      return null;
    }

    return 'Требования: латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис)';
  };
};

export const phone = (): Validator<string> => {
  return (value = '') => {
    if (/^\+?\d{10,15}$/.test(value)) {
      return null;
    }

    return 'Требования: от 10 до 15 символов, состоит из цифр, может начинается с плюса';
  };
};

export const password = (): Validator<string> => {
  return (value = '') => {
    if (/^(?=.*\d)(?=.*[A-Z])[^\s]{7,40}$/.test(value)) {
      return null;
    }

    return 'Требования: от 7 до 40 символов, обязательно хотя бы одна заглавная буква и цифра';
  };
};
