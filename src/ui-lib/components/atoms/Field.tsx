import { useFormFieldContext } from '#/ui-lib/components/atoms/Form';
import {
  FieldDirection,
  FieldState,
  FieldContext as IFieldContextBase,
} from '#/ui-lib/types';
import { getDimensions } from '#/ui-lib/utils/dimensions';
import { merge } from 'lodash';
import {
  createContext,
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useContext,
  useId,
  useRef,
} from 'react';

const DEFAULT_DIRECTION: FieldDirection = 'vertical';

const DIRECTION_TO_FLEX: Record<
  FieldDirection,
  {
    alignItems: CSSProperties['alignItems'];
    flexDirection: CSSProperties['flexDirection'];
  }
> = {
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vertical: {
    flexDirection: 'column',
    alignItems: undefined,
  },
};

const STATE_TO_COLOR: Record<
  FieldState,
  {
    message: string;
    label: string;
  }
> = {
  valid: {
    message: 'rgba(0,0,0,0.5)',
    label: '',
  },
  invalid: {
    message: 'red',
    label: 'red',
  },
};
//
//
//
// --- Context --------------------------------------------------------------------------
type IFieldContext = IFieldContextBase &
  Required<Pick<IFieldContextBase, 'direction' | 'state'>> & {
    id: string;
    visibleState: FieldState;
  };

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
/**


// --- Field --------------------------------------------------------------------------  */
function Field({
  children,
  inputId,
  ...props
}: IFieldContextBase & {
  children: ReactNode;
  inputId?: string;
}) {
  const formFieldContext = useFormFieldContext();

  const id = useId();
  const contextValue: IFieldContext = {
    id: inputId || id,
    visibleState: 'valid',
    ...merge(
      {
        state: 'valid',
        direction: DEFAULT_DIRECTION,
      } satisfies Partial<IFieldContextBase>,
      formFieldContext,
      props,
    ),
  };

  if (contextValue.isTouched) {
    contextValue.visibleState = contextValue.state;
  } else {
    contextValue.visibleState = 'valid';
  }

  return (
    <Context.Provider value={contextValue}>
      <div
        style={{
          display: 'flex',
          gap: getDimensions(1),
          ...DIRECTION_TO_FLEX[contextValue.direction],
        }}>
        {children}
      </div>
    </Context.Provider>
  );
}
/**


// --- Field Label --------------------------------------------------------------------  */
function FieldLabel({ children }: PropsWithChildren) {
  const { direction, id, visibleState, required } = useFieldContext();
  const color = STATE_TO_COLOR[visibleState].label;

  return (
    <div
      style={{
        minWidth: direction === 'horizontal' ? getDimensions(24) : undefined,
      }}>
      <label
        htmlFor={id}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: getDimensions(4),
        }}>
        <span style={{ color }}>{children}</span>
        {required && <span style={{ color: 'red' }}>*</span>}
      </label>
    </div>
  );
}
/**


// --- Field Message ------------------------------------------------------------------  */
function FieldMessage({ children }: PropsWithChildren) {
  const { visibleState, error } = useFieldContext();
  const color = STATE_TO_COLOR[visibleState].message;

  return (
    <div style={{ color, height: getDimensions(4) }}>
      {visibleState === 'valid' ? null : <span>{error || children}</span>}
    </div>
  );
}
/**


// --- Field Input --------------------------------------------------------------------  */
function FieldInput({
  children,
}: {
  children: ReactNode | ((context: IFieldContext) => ReactNode);
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fieldContext = useFieldContext();

  return (
    <div
      ref={ref}
      style={{
        overflow: 'hidden',
      }}>
      {typeof children === 'function' ? children(fieldContext) : children}
    </div>
  );
}

Field.Label = FieldLabel;
Field.Input = FieldInput;
Field.Message = FieldMessage;

export { Field, useFieldContext, useNullableFieldContext };
