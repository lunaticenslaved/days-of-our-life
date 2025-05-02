import { WithInputProps } from '#/ui-lib/types';
import {
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { FaStarOfLife } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { useFocusWithin } from '#/ui-lib/hooks/focus';
import { THEME } from '#/ui-lib/theme';
import { getBorderStyles } from '#/ui-lib/utils/border';
import { getDimensions } from '#/ui-lib/utils/dimensions';
import { getSpacingStyles } from '#/ui-lib/utils/spacing';
import styled, { StyledObject } from 'styled-components';
import { TRANSITION_ALL } from '#/ui-lib/utils/transition';

export type State = 'error' | 'valid';

// --- Background ---------------------------------------------------------------
export function Backgroud({
  children,
  state,
  required,
}: {
  children: ReactNode;
  state: State;
  required: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isFocusWithin = useFocusWithin(ref);

  const borderColor = state === 'error' ? 'red' : 'white';
  const color = state === 'error' ? 'red' : 'white';
  const showBorder = isFocusWithin || state !== 'valid';

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: THEME.components.input.backgroundColor,
        color: THEME.components.input.color,
        ...getBorderStyles({ borderRadius: 's' }),
        minHeight: getDimensions(THEME.components.input.height['m']),
        width: '100%',
        boxSizing: 'border-box',
        border: showBorder ? `1px solid ${borderColor}` : undefined,
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: required ? 'calc(100% - 25px)' : '100%',
          right: required ? '25px' : undefined,
          ...getSpacingStyles(THEME.components.input.spacing['m']),
          minHeight: getDimensions(THEME.components.input.height['m']),
          height: 'max-content',
        }}>
        {children}
      </div>

      {!!required && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            height: '100%',
            width: '25px',
            background: 'rgba(255,255,255, 0.05)',
            paddingTop: '14px',
          }}>
          <FaStarOfLife
            fill={color}
            style={{
              fontSize: '10px',
              opacity: 0.6,
            }}
          />
        </div>
      )}
    </div>
  );
}

// --- Required Mark -------------------------------------------------------------
export function RequiredMark({ state }: { state: State }) {
  const color = state === 'error' ? 'red' : 'white';

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '25px',
        background: 'rgba(255,255,255, 0.05)',
      }}>
      <FaStarOfLife
        fill={color}
        style={{
          fontSize: '10px',
          opacity: 0.6,
        }}
      />
    </div>
  );
}

// --- Info for Suffix and Prefix ------------------------------------------------
export function Info({ children, state }: { children: ReactNode; state: State }) {
  const color = state === 'error' ? 'red' : 'white';

  return <div style={{ opacity: 0.6, color }}>{children}</div>;
}

// --- Clear button --------------------------------------------------------------
const ClearButtonEL = styled.button(() => {
  const styles: StyledObject = {
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    cursor: 'pointer',
    padding: 0,
    margin: 0,
    height: 'max-content',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '*': {
      transition: TRANSITION_ALL,
      color: 'rgba(255,255,255,0.6)',
    },

    '&:hover *': {
      color: 'rgba(255,255,255,1)',
    },
  };

  return styles;
});
export function ClearButton({ onClear }: { onClear: () => void }) {
  return (
    <ClearButtonEL
      onClick={e => {
        onClear();
        e.stopPropagation();
        e.preventDefault();
      }}>
      <FaXmark
        style={{
          color: 'inherit',
          transition: TRANSITION_ALL,
          fontSize: '15px',
        }}
      />
    </ClearButtonEL>
  );
}

// --- Input Field ---------------------------------------------------------------
type InputProps = WithInputProps<
  string | undefined,
  InputHTMLAttributes<HTMLInputElement>
> & {
  debounceMs?: number;
  convertValue?: (value: string | undefined) => string | undefined;
  append?: ReactNode;
  prepend?: ReactNode;
  hideClear?: boolean;
  state?: 'error' | 'valid';
  required?: boolean;
};
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      debounceMs = 0,
      value,
      onValueUpdate,
      convertValue,
      append,
      prepend,
      hideClear,
      state = 'valid',
      required = false,
      ...props
    },
    ref,
  ) => {
    const [localValue, _setLocalValue] = useState(() => {
      return convertValue ? convertValue(value) : value;
    });

    const setLocalValue = useCallback(
      (newValue: string = '') => {
        _setLocalValue(convertValue ? convertValue(newValue) : newValue);
      },
      [convertValue],
    );

    useDebounce(
      () => {
        onValueUpdate?.(localValue || '');
      },
      [localValue],
      {
        ms: debounceMs,
      },
    );

    return (
      <Backgroud state={state} required={required}>
        {!!prepend && <Info state={state}>{prepend}</Info>}
        <input
          ref={ref}
          {...props}
          style={{
            width: '100%',
            outlineWidth: '0',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: 'inherit',
            padding: 0,
            margin: 0,
            color: 'white',
          }}
          value={localValue || ''}
          onChange={e => {
            setLocalValue(e.target.value);
            props.onChange?.(e);
          }}
        />
        {!hideClear && (
          <ClearButton
            onClear={() => {
              setLocalValue('');
            }}
          />
        )}
        {!!append && <Info state={state}>{append}</Info>}
      </Backgroud>
    );
  },
);

function useDebounce(
  cb: () => void,
  deps: unknown[],
  options: {
    ms: number;
  },
) {
  const isMountedRef = useRef(false);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (isMountedRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (options.ms > 0) {
        timeoutRef.current = setTimeout(cb, options.ms) as unknown as number;
      } else {
        cb();
      }
    }

    isMountedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
