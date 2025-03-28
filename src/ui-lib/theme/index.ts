import { sizeMap } from '#/ui-lib/utils/size';
import { spacingMap } from '#/ui-lib/utils/spacing';

export const THEME = {
  colors: {
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
    error: {
      main: 'rgba(255,0,0,0.4)',
      light: 'rgba(255,0,0,0.4)',
      dark: 'rgba(255,0,0,0.4)',
      contrastText: 'white',
    },
    background: {
      main: '#161D24',
      light: '#161D24',
      dark: '#161D24',
      contrastText: '#fff',
    },
  },
  components: {
    input: {
      height: sizeMap({ s: 6, m: 8, l: 10 }),
      spacing: sizeMap({
        s: spacingMap({ px: 2, m: 0 }),
        m: spacingMap({ px: 2, m: 0 }),
        l: spacingMap({ px: 4, m: 0 }),
      }),
      borderRadius: sizeMap({ s: 2, m: 2, l: 2 }),
    },
    select: {
      // TODO button, input, select имеют одни типоразмеры
      height: sizeMap({ s: 6, m: 8, l: 10 }),
      borderRadius: sizeMap({ s: 2, m: 2, l: 2 }),
      spacing: sizeMap({
        s: spacingMap({ px: 2, m: 0 }),
        m: spacingMap({ px: 2, m: 0 }),
        l: spacingMap({ px: 4, m: 0 }),
      }),
    },
    button: {
      height: sizeMap({ s: 6, m: 8, l: 10 }),
      borderRadius: sizeMap({ s: 2, m: 2, l: 2 }),
      spacing: sizeMap({
        s: spacingMap({ px: 2 }),
        m: spacingMap({ px: 2 }),
        l: spacingMap({ px: 4 }),
      }),
    },
  },
};
