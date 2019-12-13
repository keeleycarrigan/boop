import React from 'react';
import { ThemeProvider } from 'styled-components';
import _find from 'lodash/find';
import _get from 'lodash/get';
import _merge from 'lodash/merge';
import _unionBy from 'lodash/unionBy';

import baseSettings from 'style/settings';
import { createMediaQueries } from 'style-utils';
import { createColorData } from 'style/color'

const ElementsTheme = (props) => {
  const {
    theme,
    children,
  } = props;
  const themeBreakpoints = _get(theme, 'breakpoints', []);
  const themeColors = _get(theme, 'colors', {});
  const breakpoints = _unionBy(themeBreakpoints, baseSettings.breakpoints, 'name');
  const customTheme = {
    ...baseSettings,
    ...theme,
    breakpoints,
    colors: createColorData(_merge({}, baseSettings.colors, themeColors)),
    queries: createMediaQueries(breakpoints),
  }

  return (
    <ThemeProvider theme={customTheme}>
      <React.Fragment>
        {children}
      </React.Fragment>
    </ThemeProvider>
  )
};

ElementsTheme.defaultProps = {
  theme: {}
}

export default ElementsTheme;
