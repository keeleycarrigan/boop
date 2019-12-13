import styled, { css } from 'styled-components';
import {
  lighten,
  rgba,
} from 'polished';

import { modifiers } from 'style-utils/modifiers';
import { themeRems } from 'style-utils/units';
import { grayScale } from 'style/color/default';
import { disabled } from 'style-utils/mixins';
import queries from 'style/queries';


export const SelectInput = styled.select`
  appearance: none;
  background: transparent;
  border-radius: 0;
  border: none;
  color: ${grayScale.gray5};
  font-size: ${themeRems(16)};
  height: 100%;
  left: 0;
  padding-left: ${themeRems(10)};
  position: absolute;
  top: 0;
  width: 100%;

  ${queries('large')`
    font-size: ${themeRems(14)};
  `}

  &::-ms-expand {
    display: none;
  }
`;

export const SelectArrow =  styled.span`
  align-items: center;
  background-color: ${grayScale.white};
  border-left: 1px solid ${grayScale.gray5};
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  width: ${themeRems(45)};
  z-index: 1;

  ${queries('large')`
    width: ${themeRems(34)};
  `}
`;

export const SelectArrowImage = styled.svg`
  height: 75%;
  width: 75%;
  display: block;

  path {
    fill: ${grayScale.gray5};
  }
`;

export const SelectWrapper = styled.div`
  background-color: ${grayScale.white};
  border-radius: 3px;
  border: 1px solid ${grayScale.gray5};
  color: ${grayScale.gray5};
  height: ${themeRems(45)};
  position: relative;

  ${queries('large')`
    height: ${themeRems(34)};
  `}

  ${modifiers('disabled')`
    ${disabled}

    ${SelectInput} {
      color: ${rgba(grayScale.black, 0.3)};
      pointer-events: none;
    }

    ${SelectArrow} {
      border-color: ${rgba(grayScale.black, 0.1)};
    }


    ${SelectArrowImage} {
      path {
        fill: ${rgba(grayScale.black, 0.1)};
      }
    }
  `}

  ${modifiers('hasError')`
    background-color: ${lighten(0.8, 'red')};
    border-color: red

    ${SelectInput} {
      color: red;
    }

    ${SelectArrow} {
      border-color: red;
    }


    ${SelectArrowImage} {
      path {
        fill: red;
      }
    }
  `}
`;
