import { getSize } from '#/ui-lib/utils/size';
import { createContext, PropsWithChildren, ReactNode, useContext, useId } from 'react';

// --- Context --------------------------------------------------------------------------

interface IFieldContext {
  direction: 'column' | 'row';
  id: string;
}

const Context = createContext<IFieldContext | null>(null);

function useFieldContext() {
  const context = useContext(Context);

  if (!context) {
    throw new Error('Unknown field context');
  }

  return context;
}

function useNullableFieldContext() {
  const context = useContext(Context);

  return context;
}

// --- Field --------------------------------------------------------------------------
function Field({
  children,
  direction = 'column',
  inputId,
}: PropsWithChildren & {
  direction?: 'column' | 'row';
  inputId?: string;
}) {
  const id = useId();
  const contextValue: IFieldContext = {
    direction,
    id: inputId || id,
  };

  return (
    <Context.Provider value={contextValue}>
      <div
        style={{
          display: 'flex',
          gap: getSize(1),
          flexDirection: contextValue.direction,
          alignItems: contextValue.direction === 'row' ? 'center' : undefined,
        }}>
        {children}
      </div>
    </Context.Provider>
  );
}

// --- Field Label --------------------------------------------------------------------------
function FieldLabel({ children }: PropsWithChildren) {
  const { direction, id } = useFieldContext();

  return (
    <div
      style={{
        minWidth: direction === 'row' ? getSize(24) : undefined,
      }}>
      <label htmlFor={id}>{children}</label>
    </div>
  );
}

// --- Field Input --------------------------------------------------------------------------
function FieldInput({
  children,
}: {
  children: ReactNode | ((context: IFieldContext) => ReactNode);
}) {
  const context = useFieldContext();

  return <div>{typeof children === 'function' ? children(context) : children}</div>;
}

Field.Label = FieldLabel;
Field.Input = FieldInput;

export { Field, useFieldContext, useNullableFieldContext };
