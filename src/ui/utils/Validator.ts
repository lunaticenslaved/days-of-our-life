import Ajv, { DefinedError, JSONSchemaType, ValidateFunction } from 'ajv';
import _ from 'lodash';
import ajvErrors from 'ajv-errors';

const ajv = new Ajv({
  allErrors: true,
});

ajvErrors(ajv);

export class Validator<T> {
  private _validate: ValidateFunction<unknown>;

  constructor(schema: JSONSchemaType<T>) {
    this._validate = ajv.compile(schema);
  }

  validate = (values: unknown) => {
    this._validate(values);

    const errors = this._validate.errors;

    if (!errors) {
      return undefined;
    }

    return parseErrorSchema(errors as DefinedError[]);
  };
}

const parseErrorSchema = (ajvErrors: DefinedError[]) => {
  const preparedErrors: DefinedError[] = [];

  const stack: DefinedError[] = [...ajvErrors];

  console.log('not preparedErrors', ajvErrors);

  while (stack.length) {
    const ajvError = stack.shift();

    if (!ajvError) break;

    // @ts-ignore
    if (ajvError.keyword === 'errorMessage') {
      const newError = {
        // @ts-ignore
        ...(ajvError.params.errors as DefinedError[])[0],
      };

      // @ts-ignore
      newError.message = ajvError.message;
      stack.push(newError);
    } else {
      if (ajvError.keyword === 'required') {
        ajvError.instancePath += '/' + ajvError.params.missingProperty;
      }

      preparedErrors.push(ajvError);
    }
  }

  console.log('preparedErrors', preparedErrors);

  return preparedErrors.reduce<Record<string, unknown>>((acc, error) => {
    // `/deepObject/data` -> `deepObject.data`
    const path = error.instancePath.substring(1).replace(/\//g, '.');

    _.set(acc, path, error.message);

    if (!acc[path]) {
      acc[path] = {
        message: error.message,
        type: error.keyword,
      };
    }

    return acc;
  }, {});
};

export const ERROR_MESSAGES = {
  Required: 'Это поле обязательно',
  MinLengthStr: (value: number) => `Минимальное кол-во символов: ${value}`,
  MaxLengthStr: (value: number) => `Максимальное кол-во символов: ${value}`,
};
