import { css } from 'styled-components';
import _get from 'lodash/get';
import _reduce from 'lodash/reduce';

import baseSettings from 'style/settings';

export const queries = (queryName) => (...args) => ({ theme }) => {
  const query = _get(theme, `queries.${queryName}`) || _get(baseSettings, `queries.${queryName}`);

  if (query) {
    return css`
      @media ${query} {
        ${css(...args)}
      }
    `;
  }
}

export default queries;
