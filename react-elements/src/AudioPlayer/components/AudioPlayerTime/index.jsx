import React from 'react';

import { AudioTime } from 'AudioPlayer/styles';

export default function AudioPlayerTime({ time, ...props }) {
  return (
    <AudioTime { ...props }>
      { time }
    </AudioTime>
  );
}
