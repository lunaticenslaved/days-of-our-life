import type { Preview } from '@storybook/react';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

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
    Story => <StyleSheetManager shouldForwardProp={isPropValid}>
        <Story />
    </StyleSheetManager>
  ],
};

export default preview;
