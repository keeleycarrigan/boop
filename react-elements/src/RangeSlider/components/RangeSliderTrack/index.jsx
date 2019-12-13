import React from 'react';

import withRangeSliderContext from 'RangeSlider/HOC/withRangeSliderContext';

import {
  RangeTrack,
  RangeTrackBar,
  RangeTrackHead,
} from 'RangeSlider/styles';

function BaseRangeTrack(props) {
  const {
    children,
    range,
  } = props;

  return (
    <React.Fragment>
      <RangeTrack>
        <RangeTrackBar
          style={{ width: `${range}%` }}
        />
      </RangeTrack>
      {children}
      <RangeTrackHead
        style={{ left: `${range}%` }}
      />
    </React.Fragment>
  )
}

const RangeSliderTrack = withRangeSliderContext(BaseRangeTrack);

export default RangeSliderTrack;
