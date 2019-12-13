import styled from 'styled-components';


import { rems } from 'style-utils/units';
import createBreakpointModifiers, { modifiers } from 'style-utils/modifiers';
import Box from 'layout/Box';


export const gridColumns = createBreakpointModifiers([
  {
    cssProp: 'width',
    propName: 'cols',
    valTransform: (val, { columns }) => `${(parseInt(val, 10) / columns) * 100}%`,
  },
  {
    cssProp: 'margin-left',
    propName: 'offsetCols',
    valTransform: (val, { columns }) => `${(parseInt(val, 10) / columns) * 100}%`,
  },
]);

const getMaxWidth = ({ theme }) => rems(theme.maxRowWidth + theme.columnGutter, theme.basePixels);
const nestedMargin = ({ theme }) => rems(-theme.columnGutter / 2, theme.basePixels);
const columnPadding = ({ theme }) => rems(theme.columnGutter / 2, theme.basePixels);

export const Row = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
  max-width: ${getMaxWidth};
  width: 100%;

  ${modifiers('collapse')`
    margin-left: 0;
    margin-right: 0;

    > ${Column} {
      padding-left: 0;
      padding-right: 0;
    }
  `}

  ${modifiers('nest')`
    flex-grow: inherit;
    margin-left: ${nestedMargin};
    margin-right: ${nestedMargin};
    max-width: none;
    width: auto;
  `}
`;

export const Column = styled(Box)`
  flex: 0 0 auto;
  padding-left: ${columnPadding};
  padding-right: ${columnPadding};
  width: 100%;

  ${gridColumns}

  ${modifiers('flex')`
    display: flex;
  `}
`;
