import { FFComponentProps, FField, FFieldExtendableProps } from './FField';
import React from 'react';

interface FFTextInputProps extends FFieldExtendableProps {}

function Component(props: FFComponentProps<string | undefined, HTMLInputElement>) {
  return <input {...props} />;
}

export const FFTextInput: React.FC<FFTextInputProps> = props => {
  return (
    <FField<string | undefined, HTMLInputElement> {...props} component={Component} />
  );
};
