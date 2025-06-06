import {
  InputBackground,
  InputClearButton,
  InputInfo,
  InputState,
} from '#/ui-lib/components';
import { WithInputProps } from '#/ui-lib/types';
import { HTMLProps, ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

type TextAreaProps = WithInputProps<
  string | undefined,
  Omit<HTMLProps<HTMLTextAreaElement>, 'label'> & {
    maxRows?: number;
    append?: ReactNode;
    prepend?: ReactNode;
    required?: boolean;
    state?: InputState;
    clearable?: boolean;
    label?: ReactNode;
    disabled?: boolean;
  }
>;
export function TextArea({
  value: valueProp,
  onValueUpdate,
  append,
  prepend,
  required = false,
  state = 'valid',
  clearable,
  label,
  disabled = false,
  ...props
}: TextAreaProps) {
  const [value, _setValue] = useState(valueProp);

  useEffect(() => {
    _setValue(valueProp);
  }, [valueProp]);

  const { ref } = useAutoSize();

  return (
    <InputBackground disabled={disabled} state={state} required={required} label={label}>
      <div style={{ display: 'flex', gap: '8px', padding: '10px 0', width: '100%' }}>
        {!!append && <InputInfo state={state}>{append}</InputInfo>}
        <StyledTextArea
          {...props}
          ref={ref}
          value={value ? String(value) : ''}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            width: '100%',
            outlineWidth: '0',
            outline: 'none',
            border: 'none',
            resize: 'none',
            overflow: 'visible',
            fontSize: 'inherit',
            ...props.style,
            height: 'auto',
            padding: '0',
            margin: 0,
            maxHeight: '400px',
          }}
          onChange={e => {
            const value = e.target.value;

            onValueUpdate?.(value);
            props.onChange?.(e);
            _setValue(value);
          }}
          onPaste={event => {
            const target = event.target as HTMLTextAreaElement;

            onValueUpdate?.(target.value);
            props.onChange?.(event);
            _setValue(value);
          }}
        />
        {!!clearable && !!value && <InputClearButton onClear={() => _setValue('')} />}
        {!!prepend && <InputInfo state={state}>{prepend}</InputInfo>}
      </div>
    </InputBackground>
  );
}

const StyledTextArea = styled.textarea(() => {
  return {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  };
});

function useAutoSize() {
  const currentEl = useRef<HTMLTextAreaElement>();
  const removeListenersFn = useRef<() => void>(() => null);

  return {
    ref: (text: HTMLTextAreaElement) => {
      if (text) {
        const resize = () => {
          text.style.height = 'auto';
          text.style.height = text.scrollHeight + 'px';
        };

        /* 0-timeout to get the already changed text */
        const delayedResize = () => {
          setTimeout(resize, 0);
        };

        removeListenersFn.current();

        resize();

        text.addEventListener('change', resize);
        text.addEventListener('cut', delayedResize);
        text.addEventListener('paste', delayedResize);
        text.addEventListener('drop', delayedResize);
        text.addEventListener('keydown', delayedResize);

        removeListenersFn.current = () => {
          text.removeEventListener('change', resize);
          text.removeEventListener('cut', delayedResize);
          text.removeEventListener('paste', delayedResize);
          text.removeEventListener('drop', delayedResize);
          text.removeEventListener('keydown', delayedResize);
        };
      }

      currentEl.current = text || undefined;
    },
  };
}
