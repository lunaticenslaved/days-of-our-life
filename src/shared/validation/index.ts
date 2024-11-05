export { Validator } from './Validator';

export const ERROR_MESSAGES = {
  required: 'Это поле обязательно',

  gt: (value: number) => `Должно быть больше ${value}`,
  gte: (value: number) => `Должно быть не менее ${value}`,

  minNumber: (value: number) => `Минимальное значение: ${value}`,
  maxNumber: (value: number) => `Максимальное значение: ${value}`,

  minLengthStr: (value: number) => `Минимальное кол-во символов: ${value}`,
  maxLengthStr: (value: number) => `Максимальное кол-во символов: ${value}`,

  minLengthArr: (value: number) => `Минимальное кол-во элементов: ${value}`,
  maxLengthArr: (value: number) => `Максимальное кол-во элементов: ${value}`,

  oneOf: (items: (string | number)[]) =>
    `Значение должно быть одним из ${items.join(', ')}`,
};
