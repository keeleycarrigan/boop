import React from 'react';
import { storiesOf } from '@storybook/react';

import AudioPlayer from '../src/AudioPlayer';

storiesOf('AudioPlayer', module)
  .add('Default', () => (
    <AudioPlayer
      id="default-audio-player"
      sources={[{ url: 'test.mp3', type: 'mp3' }]}
    />
  ))
  .add('No Timestamps', () => (
    <AudioPlayer
      id="simple-audio-player"
      showTimestamps={false}
      sources={[{ url: '/stories/static/test.mp3', type: 'mp3' }]}
    />
  ));
  