import _find from 'lodash/find';
import _get from 'lodash/get';
import _merge from 'lodash/merge';
import _unionBy from 'lodash/unionBy';

import { createMediaQueries } from 'style-utils';
import { grayScale } from 'style/color/default';

export const baseSettings =  {
  basePixels: 16,
  breakpoints: [
    {
      name: 'small', // 0 - 640px
      lower: '0em',
      upper: '40em',
    },
    {
      name: 'medium', // 641px - 768px
      lower: '40.0625em',
      upper: '48em',
    },
    {
      name: 'large', // 769px - 1024px
      lower: '48.0625em',
      upper: '64em',
    },
    {
      name: 'xlarge', // 1025px - 1330px
      lower: '64.0625em',
      upper: '83.125em',
    }
  ],
  columns: 12,
  columnGutter: 20,
  colors: {
    grayScale: { ...grayScale }
  },
  maxRowWidth: 1330,
};


export default {
  ...baseSettings,
  colors: _merge({}, baseSettings.colors),
  queries: createMediaQueries(baseSettings.breakpoints),
};
