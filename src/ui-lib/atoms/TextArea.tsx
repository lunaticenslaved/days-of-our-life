import { THEME } from '#/ui-lib/theme';
import { WithInputProps } from '#/ui-lib/types';
import { getDimensions } from '#/ui-lib/utils/dimensions';
import { Size } from '#/ui-lib/utils/size';
import { getSpacingStyles } from '#/ui-lib/utils/spacing';
import { HTMLProps, useLayoutEffect, useRef, useState } from 'react';

type TextAreaProps = WithInputProps<
  string | undefined,
  HTMLProps<HTMLTextAreaElement> & {
    maxRows?: number;
  }
>;

const SIZE: Size = 'm';

const MAX_ROWS = 1000;

const useAutoSize = (maxRows: number = MAX_ROWS, valueText: string) => {
  const [isOverflowAuto, setIsOverflowAuto] = useState(false);
  const [textAreaHeight, setTextAreaHeight] = useState('auto');

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    const currentMaxRows = maxRows ?? MAX_ROWS;

    if (!textAreaRef.current) {
      return;
    }

    const currentLineHeight = parseInt(
      getComputedStyle(textAreaRef.current)?.lineHeight,
      10,
    );
    const maxHeight = currentLineHeight * currentMaxRows;

    const paddingCompensation =
      parseInt(getComputedStyle(textAreaRef.current).paddingTop, 10) +
      parseInt(getComputedStyle(textAreaRef.current).paddingBottom, 10);

    const currentScrollHeight = textAreaRef.current.scrollHeight;

    if (!valueText) {
      setTextAreaHeight(`${currentScrollHeight - paddingCompensation}px`);
      return;
    }

    const currentCountRows = Math.floor(
      (currentScrollHeight - paddingCompensation) / currentLineHeight,
    );

    if (currentCountRows < currentMaxRows) {
      setTextAreaHeight(`${textAreaRef.current?.scrollHeight}px`);
      setIsOverflowAuto(false);
    } else {
      setTextAreaHeight(`${maxHeight}px`);
      setIsOverflowAuto(true);
    }
  }, [valueText, maxRows]);

  return {
    isOverflowAuto,
    setTextAreaHeight,
    textAreaHeight,
    textAreaRef,
  };
};

export function TextArea({
  value,
  onValueUpdate,
  maxRows = MAX_ROWS,
  ...props
}: TextAreaProps) {
  const { isOverflowAuto, setTextAreaHeight, textAreaHeight, textAreaRef } = useAutoSize(
    maxRows,
    value || '',
  );

  return (
    <textarea
      {...props}
      ref={textAreaRef}
      value={value ? String(value) : ''}
      style={{
        padding: 0,
        minHeight: getDimensions(THEME.components.textArea.minHeight[SIZE]),
        borderRadius: getDimensions(THEME.components.textArea.borderRadius[SIZE]),
        backgroundColor: THEME.components.textArea.backgroundColor,
        color: THEME.components.textArea.color,
        width: '100%',
        outlineWidth: '0',
        outline: 'none',
        border: 'none',
        resize: 'none',
        overflow: isOverflowAuto ? 'auto' : 'visible',
        ...getSpacingStyles(THEME.components.textArea.spacing[SIZE]),
        ...props.style,
        height: textAreaHeight,
      }}
      onChange={e => {
        const value = e.target.value;

        onValueUpdate?.(value);
        props.onChange?.(e);
        setTextAreaHeight('auto');
      }}
      onPaste={event => {
        const target = event.target as HTMLTextAreaElement;

        onValueUpdate?.(target.value);
        props.onChange?.(event);
        setTextAreaHeight('auto');
      }}
    />
  );
}
