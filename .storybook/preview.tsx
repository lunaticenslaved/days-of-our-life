import type { Preview } from '@storybook/react';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

import {AppContextProvider} from '../src/client/app/AppContext'

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        // 👇 Default values
        { name: 'Dark', value: '#161D24' }, // FIXME use theme here?
      ],
      // 👇 Specify which background is shown by default
      default: 'Dark',
    },
  },
  decorators: [
    Story => <AppContextProvider api='test'>
        <Story />
    </AppContextProvider>
  ],
};

export default preview;
