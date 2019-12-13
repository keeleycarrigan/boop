import styled, { css } from 'styled-components';

import { modifiers } from 'style-utils/modifiers';
import { themeRems } from 'style-utils/units';
import { grayScale } from 'style/color/default';
import { disabled } from 'style-utils/mixins';
import queries from 'style/queries';

export const baseTextInput = css`
  appearance: none;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid ${grayScale.gray3};
  color: ${grayScale.gray5};
  display: block;
  font-family: 'Helvetica', 'Arial', 'sans-serif';
  font-size: ${themeRems(16)};
  transition: background-color 200ms linear;
  width: 100%;

  &::placeholder {
    font-style: italic;
    color: ${grayScale.gray4};
  }

  &:focus {
    outline: 1px solid ${grayScale.gray3};
  }

  ${modifiers('disabled')`
    ${disabled}
  `}

  ${modifiers('hasError')`
    border-color: red;
  `}

  ${queries('large')`
    font-size: ${themeRems(14)};
  `}
`

const TextInputElement = styled.input`
  ${baseTextInput}
  height: ${themeRems(45)};
  padding: ${themeRems([3, 10, 5, 10])};

  ${queries('large')`
    height: ${themeRems(34)};
  `}

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* clears the 'X' from Internet Explorer */
  &[type="search"]::-ms-clear {  display: none; width : 0; height: 0; }
  &[type="search"]::-ms-reveal {  display: none; width : 0; height: 0; }

  /* clears the 'X' from Chrome */
  &[type="search"]::-webkit-search-decoration,
  &[type="search"]::-webkit-search-cancel-button,
  &[type="search"]::-webkit-search-results-button,
  &[type="search"]::-webkit-search-results-decoration { display: none; }
`;

export default TextInputElement;
