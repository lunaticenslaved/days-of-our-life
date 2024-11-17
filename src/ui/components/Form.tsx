import { createContext, HTMLProps, ReactNode, useContext } from 'react';

interface FormContext {
  disabled: boolean;
}

const FormContext = createContext<FormContext | null>(null);

function useFormContext() {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('FormContext not found');
  }

  return context;
}

interface FormProps extends HTMLProps<HTMLFormElement> {
  children: ReactNode;
  disabled?: boolean;
}

export function Form({ style, disabled, ...props }: FormProps) {
  return (
    <FormContext.Provider value={{ disabled: !!disabled }}>
      <form style={{ display: 'contents', ...style }} {...props} />
    </FormContext.Provider>
  );
}

interface FormContentProps {
  children: ((value: FormContext) => ReactNode) | ReactNode;
}

function FormContent({ children }: FormContentProps) {
  const context = useFormContext();

  return <div>{typeof children === 'function' ? children(context) : children}</div>;
}

interface FormFooterProps {
  children: ((value: FormContext) => ReactNode) | ReactNode;
}

function FormFooter({ children }: FormFooterProps) {
  const context = useFormContext();

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {typeof children === 'function' ? children(context) : children}
    </div>
  );
}

Form.Footer = FormFooter;
Form.Content = FormContent;
