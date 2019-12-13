import styled from 'styled-components';
import { rgba } from 'polished';

import {
  black,
  white,
} from 'style/color/default';
import { themeRems } from 'style-utils/units';
import { modifiers } from 'style-utils/modifiers';
import queries from 'style/queries';
import spacing from 'layout/spacing';
import display from 'layout/display';
import align from 'layout/align';
import textAlign from 'style/text/align';
import textSize from 'style/text/size';
import colors from 'style/color';

export const DialogBox = styled.div`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  background-color: ${white};
  position: relative;

  ${queries('medium')`
    height: auto;
    max-width: ${themeRems(556)};
  `}

  ${display}
  ${align}
  ${spacing}
  ${colors}
  ${textAlign}
  ${textSize}
`;

export const DialogWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  background: ${rgba(black, 0.7)};
  overflow-y: auto;
  width: 100%;
  height: 100%;

  ${modifiers('small')`
    padding-left: ${themeRems(10)};
    padding-right: ${themeRems(10)};

    ${DialogBox} {
      height: auto;
      width: calc(100% - ${themeRems(20)});

      ${queries('medium')`
        max-width: ${themeRems(364)};
      `}
    }
  `}

  ${modifiers('large')`
    ${queries('medium')`
      justify-content: flex-start;

      ${DialogBox} {
        max-width: ${themeRems(748)};
        margin: ${themeRems([120, 'auto', 60, 'auto'])};
        position: relative;
        left: 0;
        top: 0;
        transform: none;
      }
    `}
  `}
`;

export const DialogContent = styled.div`
  height: 100%;
  overflow-y: auto;
`;

export const DialogActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  z-index: 5;  
`;

export default {
  DialogActions,
  DialogBox,
  DialogContent,
  DialogWrap,
}
