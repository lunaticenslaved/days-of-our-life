import { useFormFieldContext } from '#/ui-lib/atoms/Form';
import {
  FieldDirection,
  FieldState,
  FieldContext as IFieldContextBase,
} from '#/ui-lib/types';
import { getSize } from '#/ui-lib/utils/size';
import { merge } from 'lodash';
import {
  createContext,
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
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
    border: string;
  }
> = {
  valid: {
    message: 'rgba(0,0,0,0.5)',
    label: '',
    border: 'black',
  },
  invalid: {
    message: 'red',
    label: 'red',
    border: 'red',
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
          gap: getSize(1),
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
        minWidth: direction === 'horizontal' ? getSize(24) : undefined,
      }}>
      <label htmlFor={id}>
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
    <div style={{ color, height: getSize(5) }}>
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
  const isFocusWithin = useFocusWithin(ref);

  const borderColor = STATE_TO_COLOR[fieldContext.visibleState].border;

  return (
    <div
      ref={ref}
      style={{
        height: getSize(8),
        borderRadius: getSize(1),
        overflow: 'hidden',
        ...(isFocusWithin
          ? {
              border: `2px solid ${borderColor}`,
            }
          : {
              border: `1px solid ${borderColor}`,
            }),
      }}>
      {typeof children === 'function' ? children(fieldContext) : children}
    </div>
  );
}

Field.Label = FieldLabel;
Field.Input = FieldInput;
Field.Message = FieldMessage;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFocusWithin(ref: React.RefObject<Element>) {
  const [isFocused, setIsFocused] = useState<boolean | undefined>(false);

  useEffect(() => {
    const el = ref.current;

    function hasFocusWithin(element: Element | null): boolean {
      if (!element || !document) return false;
      return element?.contains(document.activeElement);
    }

    function onFocusIn() {
      if (!el) {
        setIsFocused(false);
      } else {
        const newIsFocusWithin = hasFocusWithin(el);

        setIsFocused(newIsFocusWithin);
      }
    }

    function onFocusOut() {
      setIsFocused(false);
    }

    el?.addEventListener('focusin', onFocusIn, false);
    el?.addEventListener('focusout', onFocusOut, false);

    return () => {
      el?.removeEventListener('focusin', onFocusIn, false);
      el?.removeEventListener('focusout', onFocusOut, false);
    };
  }, [ref]);

  return isFocused;
}

export { Field, useFieldContext, useNullableFieldContext };
