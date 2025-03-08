import { Button } from '#/ui-lib/atoms/Button';
import _ from 'lodash';
import { Fragment, ReactNode } from 'react';
import { FieldArray, FieldArrayRenderProps } from 'react-final-form-arrays';

interface RenderProps<T> {
  name: string;
  index: number;
  fields: FieldArrayRenderProps<T, HTMLElement>['fields'];
  value: T;
}

interface FFieldArrayProps<T> {
  name: string;
  newElement: Partial<T>;
  addButtonText?: string;
  renderField(props: RenderProps<T>): ReactNode;
}

export function FFieldArray<T>({
  name,
  renderField,
  newElement,
  addButtonText = 'Добавить +',
}: FFieldArrayProps<T>) {
  return (
    <FieldArray<T> name={name}>
      {({ fields, meta }) => {
        return (
          <>
            <div>
              {fields.map((name, index) => {
                return (
                  <Fragment key={name}>
                    {renderField({ name, fields, index, value: fields.value[index] })}
                  </Fragment>
                );
              })}
            </div>
            <div>
              {meta.touched && typeof meta.error === 'string' ? meta.error : null}
            </div>
            <Button onClick={() => fields.push(_.cloneDeep(newElement) as T)}>
              {addButtonText}
            </Button>
          </>
        );
      }}
    </FieldArray>
  );
}
