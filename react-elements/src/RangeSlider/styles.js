import styled, { css } from 'styled-components';

import { grayScale } from 'style/color/default';
import { themeRems } from 'style-utils/units';


export const RangeTrackWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  position: relative;
  height: ${themeRems(20)};
`;

export const RangeTrack = styled.div`
  background: ${grayScale.gray1};
  border-radius: 3px;
  box-sizing: border-box;
  height: 4px;
  margin: 0;
  padding: 0;
  position: relative;
  width: 100%;

  &::before {
    border-radius: 3px;
    box-sizing: border-box;
    content: '';
    height: ${themeRems(6)};
    position: absolute;
    width: calc(100% + 2px);
    z-index: 1;
    left: -1px;
    top: -1px;
  }
`;

export const RangeTrackBar = styled.div`
  background-color: ${grayScale.gray4};
  border-radius: 3px;
  box-sizing: border-box;
  height: 4px;
`;

export const RangeTrackHead = styled.div`
  background-color: black;
  border-radius: 50%;
  box-sizing: border-box;
  height: ${themeRems(20)};
  width: ${themeRems(20)};
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

const rangeTrack = css`
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: transparent;
  overflow: hidden;
  border: none;
`;
const rangeThumb = css`
  border: none;
  height: 100%;
  width: ${themeRems(20)};
  background: transparent;
  cursor: pointer;
`;
const rangeFocus = css`
  outline: none;

  ~ ${RangeTrack} {
    &::before {
      border: 1px solid ${grayScale.gray4};
    }
  }
`;

export const RangeTrackControl = styled.input`
  background: transparent;
  border: none;
  height: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 3;
  -webkit-appearance: none;

  &:focus {
    ${rangeFocus}
  }

  &::-moz-focus-outer {
    outline: none;
    border: none;

    &::-moz-range-track {
      ${rangeFocus}
    }
  }

  &::-webkit-slider-runnable-track {
    ${rangeTrack}
  }

  &::-moz-range-track {
    ${rangeTrack}
  }

  &::-ms-track {
    ${rangeTrack}
  }

  &::-webkit-slider-thumb {
    ${rangeThumb}
    -webkit-appearance: none;
  }

  &::-moz-range-thumb {
    ${rangeThumb}
  }

  &::-ms-thumb {
    ${rangeThumb}
  }

  &::-ms-fill-lower {
    background: transparent;
  }

  &::-ms-fill-upper {
    background: transparent;
  }
`;
