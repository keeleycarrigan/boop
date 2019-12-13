import styled, { css } from 'styled-components';

export const AudioControls = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;
export const AudioPlayBtn = styled.button`
  background-color: transparent;
  border-radius: 50%;
  border: none;
  display: block;
  height: 40px;
  padding: 0;
  width: 40px;
  flex-shrink: 0;

  path,
  rect {
    fill: #A9A0A0;
    transition: fill 300ms linear;
  }

  &:focus {
    outline: none;
   
    path,
    rect {
      fill: #666666;
    }
  }
`;
export const AudioTimeline = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  padding-left: 18px;
`;
export const AudioTime = styled.span`
  color: #4A4A4A;
  font-size: 13px;
`;

export const AudioRangeTrackWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  padding-left: 10px;
  padding-right: 10px;
`;

const rangeTrack = css`
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: transparent;
  border-radius: 3px;
  overflow: hidden;
`;
const rangeThumb = css`
  border: none;
  height: 4px;
  width: 1px;
  background: transparent;
  cursor: pointer;
`;
const rangeFocus = css`
  outline: none;
  border: 1px solid #999;
`;
export const AudioRangeTrack = styled.input`
  background: #D8D8D8;
  width: 100%;
  height: 4px;
  border: 1px solid transparent;
  border-radius: 3px;
  overflow: hidden;
  -webkit-appearance: none;

  &:focus {
    ${rangeFocus}
  }

  &::-moz-focus-outer {
    border: 1px solid transparent;
    outline: none;

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
`;
