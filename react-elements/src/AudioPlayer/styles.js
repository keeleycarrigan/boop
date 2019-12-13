import styled from 'styled-components';

import RangeSlider from 'RangeSlider';
import { RangeTrackHead } from 'RangeSlider/styles';

import { grayScale } from 'style/color/default';
import { themeRems } from 'style-utils/units';

export const AudioControls = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;
export const AudioPlayBtn = styled.button`
  background-color: transparent;
  border-radius: 50%;
  border: none;
  box-sizing: border-box;
  display: block;
  flex-shrink: 0;
  height: ${themeRems(40)};
  padding: 0;
  width: ${themeRems(40)};

  path,
  rect {
    fill: ${grayScale.gray4};
    transition: fill 200ms linear;
  }

  &:focus {
    outline: none;
   
    path,
    rect {
      fill: ${grayScale.black};
    }
  }

  ::-moz-focus-inner {
    border: none;
  }
`;
export const AudioTimeline = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  padding-left: ${themeRems(18)};
`;
export const AudioTime = styled.span`
  color: ${grayScale.gray4};
  font-size: ${themeRems(12)};
  font-family: 'Helvetica', 'Arial', 'sans-serif';
`;

export const AudioPlayerTrack = styled(RangeSlider)`
  height: 4px;
  margin-left: ${themeRems(10)};
  margin-right: ${themeRems(10)};

  ${RangeTrackHead} {
    background-color: transparent;
    height: 4px;
    width: 2px;
  }
`;
