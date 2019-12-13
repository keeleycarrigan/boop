import React from 'react';

import RangeSliderTrack from 'RangeSlider/components/RangeSliderTrack';

import { AudioPlayerTrack } from 'AudioPlayer/styles';

function AudioPlayerTrackBar(props) {
  return (
    <AudioPlayerTrack {...props} >
      <RangeSliderTrack />
    </AudioPlayerTrack>
  )
}

export default AudioPlayerTrackBar;
