import {
  createGlobalStyle,
  css,
} from 'styled-components';
import { rgba } from 'polished';

import { grayScale } from 'style/color/default';

export const GlobalReset = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;

export const clearfix = css`
  &::before,
  &::after {
    display: table;
    content: '';
  }

  &::after {
    clear: both;
  }
`;

export const visuallyHidden = css`
  border: none;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  width: 1px;
`;

export const disabled = css`
  color: ${grayScale.gray3};
  background-color: ${grayScale.gray1};
  border: 1px solid ${rgba(grayScale.black, 0.1)};
`;
