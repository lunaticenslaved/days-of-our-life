import { THEME } from '#/ui-lib/theme';
import { WithInputProps } from '#/ui-lib/types';
import { getDimensions } from '#/ui-lib/utils/dimensions';
import { Size } from '#/ui-lib/utils/size';
import { getSpacingStyles } from '#/ui-lib/utils/spacing';
import { HTMLProps } from 'react';

type TextAreaProps = WithInputProps<string | undefined, HTMLProps<HTMLTextAreaElement>>;

const SIZE: Size = 'm';

export function TextArea({ value, onValueUpdate, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      value={value ? String(value) : ''}
      style={{
        minHeight: getDimensions(THEME.components.textArea.minHeight[SIZE]),
        borderRadius: getDimensions(THEME.components.textArea.borderRadius[SIZE]),
        width: '100%',
        outlineWidth: '0',
        outline: 'none',
        border: 'none',
        resize: 'vertical',
        ...getSpacingStyles(THEME.components.textArea.spacing[SIZE]),
        ...props.style,
      }}
      onChange={e => {
        const value = e.target.value;

        onValueUpdate?.(value);
        props.onChange?.(e);
      }}
    />
  );
}
