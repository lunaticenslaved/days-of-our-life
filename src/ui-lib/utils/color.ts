import { THEME } from '#/ui-lib/theme';

export type Color = 'primary' | 'secondary' | 'background' | 'error';
export type ColorShade = 'main' | 'light' | 'dark' | 'contrastText';

export type ColorInherit = 'inherit';
export type ColorTransparent = 'transparent';

export interface ColorProps<T extends string | void = void> {
  color?: T extends string ? Color | T : Color;
}

export function getColor(arg: {
  color: Color | ColorInherit | ColorTransparent;
  shade: Exclude<ColorShade, 'contrastText'>;
}): string {
  if (arg.color === 'inherit') {
    return 'inherit';
  }

  if (arg.color === 'transparent') {
    return 'transparent';
  }

  return THEME.colors[arg.color][arg.shade];
}

export function getTextColor(color: Color | ColorInherit | ColorTransparent) {
  if (color === 'inherit') {
    return 'inherit';
  }

  if (color === 'transparent') {
    return 'inherit';
  }

  return THEME.colors[color].contrastText;
}
