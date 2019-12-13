import React from 'react';
import PropTypes from 'prop-types';

import { AudioRangeTrack } from './styles';

export default function AudioTrackBar({ value, trackColor, progressColor, ...props }) {
  const progress = 100 - value;
  return (
    <AudioRangeTrack
      max="100"
      min="0"
      step="any"
      style={ { background: `linear-gradient(to left, ${trackColor} ${progress}%, ${progressColor} ${progress}%)` } }
      type="range"
      value={ value }
      { ...props }
    />
  );
}

AudioTrackBar.defaultProps = {
  onChange      : () => { },
  onMouseDown   : () => { },
  onMouseUp     : () => { },
  progressColor : '#666666',
  trackColor    : '#D8D8D8',
  value         : 0,
};

AudioTrackBar.propTypes = {
  onChange      : PropTypes.func,
  onMouseDown   : PropTypes.func,
  onMouseUp     : PropTypes.func,
  progressColor : PropTypes.string,
  trackColor    : PropTypes.string,
  value         : PropTypes.number,
};
