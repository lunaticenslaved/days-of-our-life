export type Color = 'primary' | 'secondary' | 'background';
export type ColorShade = 'main' | 'light' | 'dark';

export interface ColorProps {
  color: Color | 'inherit';
}

// 3E92CC
// 2A628F
// 13293D
// 16324F
// 18435A

const COLOR = {
  primary: {
    main: '#fff',
    light: '#fff',
    dark: '#fff',
    contrastText: '#161D24',
  },
  secondary: {
    main: 'rgba(255,255,255,0.4)',
    light: 'rgba(255,255,255,0.4)',
    dark: 'rgba(255,255,255,0.4)',
    contrastText: '#161D24',
  },
  background: {
    main: '#161D24',
    light: '#161D24',
    dark: '#161D24',
    contrastText: '#fff',
  },
} as const;

export function getColorShade(
  color: Color | 'inherit',
  shade: ColorShade | 'contrastText',
) {
  if (color === 'inherit') {
    return 'unherit';
  }

  return COLOR[color][shade];
}

export function getColorShades(color: Color) {
  return COLOR[color];
}
