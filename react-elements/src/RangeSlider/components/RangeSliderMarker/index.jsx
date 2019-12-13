import React from 'react';

import withRangeSliderContext from 'RangeSlider/HOC/withRangeSliderContext';

import {
  Marker,
  MarkerLabel,
  MarkerWrapper,
} from 'RangeSlider/components/RangeSliderMarker/styles';

function BaseRangeMarker(props) {
  const {
    children,
    max,
    min,
    at,
    range,
  } = props;
  const markerPosition = ((at - min) * 100) / (max - min)

  return (
    <MarkerWrapper
      active={parseFloat(range, 10) >= parseFloat(at, 10)}
      position={markerPosition}
    >
      <Marker />
      <MarkerLabel>{children}</MarkerLabel>
    </MarkerWrapper>
  )
}

const RangeSliderMarker = withRangeSliderContext(BaseRangeMarker);

export default RangeSliderMarker;
