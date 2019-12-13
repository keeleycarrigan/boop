import styled from 'styled-components';

import { grayScale } from 'style/color/default';
import { themeRems } from 'style-utils/units';
import { modifiers } from 'style-utils/modifiers';

export const Marker = styled.div`
  height: ${themeRems(24)};
  width: ${themeRems(4)};
  border-radius: 2px;
  background-color: ${grayScale.gray1};
`;

export const MarkerWrapper = styled.div`
  position: absolute;
  left: ${({ position }) => position}%;
  top: -2px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;

  ${modifiers('active')`
    ${Marker} {
      background-color: ${grayScale.gray4};
    }
  `}
`;

export const MarkerLabel = styled.p`
  padding-top: ${themeRems(4)};
  margin: 0;
  font-family: 'Helvetica', 'Arial', 'sans-serif';
  font-size: ${themeRems(12)};
`;
