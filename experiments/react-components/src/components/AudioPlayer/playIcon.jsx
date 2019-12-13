import React from 'react';
import PropTypes from 'prop-types';

import { AudioPlayBtn } from './styles';

export default function AudioPlayIcon({ isPlaying }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
      <title>Play/Pause</title>
      <path d="M25,50A25,25,0,1,1,50,25,25,25,0,0,1,25,50ZM25,4A21,21,0,1,0,46,25,21,21,0,0,0,25,4Z" />
      {(() => {
        if (isPlaying) {
          return (
            <g>
              <rect id="Rectangle" x="16.5" y="13.5" width="7" height="23" rx="2" />
              <rect x="26.5" y="13.5" width="7" height="23" rx="2" />
            </g>
          );
        }
        return (
          <path d="M34.25,24.46,19.61,13.17a1,1,0,0,0-1.05-.1A1,1,0,0,0,18,14V36.53a1,1,0,0,0,.56.9,1,1,0,0,0,.44.1,1,1,0,0,0,.61-.2L34.25,26a1,1,0,0,0,0-1.58Z" />
        );
      })()}
    </svg>
  );
}

AudioPlayBtn.defaultProps = {
  isPlaying: false,
};

AudioPlayBtn.propTypes = {
  isPlaying: PropTypes.bool,
};
