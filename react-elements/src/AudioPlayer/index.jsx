import React, {
  PureComponent
} from 'react';
import PropTypes from 'prop-types';
import _throttle from 'lodash/throttle';

import {
  convertKeyCode,
  formatTime,
  roundNumber,
} from '@momappoki/elements-utils';

import AudioPlayerIcon from 'AudioPlayer/components/AudioPlayerIcon';
import AudioPlayerTime from 'AudioPlayer/components/AudioPlayerTime';
import AudioPlayerTrackBar from 'AudioPlayer/components/AudioPlayerTrackBar';
import {
  AudioControls,
  AudioPlayBtn,
  AudioTimeline,
} from 'AudioPlayer/styles';

function renderAudioSource(source, idx) {
  return <source key={ `src-${idx}` } src={ source.url } type={ `audio/${source.type}` } />;
}

/**
 * Audio Component
 * @param { string } - provide the audio file
 * @return - the audio tag with all related functionality scoped to this instance
 */
class AudioPlayer extends PureComponent {
  constructor(props) {
    super(props);

    const { playAudio } = props;
    this.state = {
      isPlaying     : false,
      timeLeft      : '00:00',
      timePlayed    : '00:00',
      percentPlayed : 0,
    };

    this.audio = React.createRef();
    this.audioTimeUpdating = null;
    this.controlled = typeof (playAudio) !== 'undefined';
  }

  componentDidMount() {
    // Add listeners for audio file
    this.audio.current.addEventListener('canplaythrough', this.updateTime);
    this.audio.current.addEventListener('loadedmetadata', this.updateTime);
  }

  componentDidUpdate({ playAudio: prevPlayAudio }) {
    const { playAudio } = this.props;

    if (playAudio !== prevPlayAudio) {
      this.controlled = typeof (playAudio) !== 'undefined';

      if (this.controlled) {
        if (playAudio) {
          this.playAudio();
        } else {
          this.pauseAudio();
        }
      }
    }
  }

  componentWillUnmount() {
    // Clear listeners for audio
    this.audio.current.removeEventListener('canplaythrough', this.updateTime);
    this.audio.current.removeEventListener('loadedmetadata', this.updateTime);
    this.audio.current.removeEventListener('timeupdate', this.updateTime);
    window.cancelAnimationFrame(this.audioTimeUpdating);
  }

  onAudioEnded = () => {
    const {
      id,
      onEnd,
    } = this.props;

    this.pauseAudio();
    onEnd(id);
  }

  getNewPlayerCurrentTime(percent) {
    return this.audio.current.duration * roundNumber((percent / 100), 2);
  }

  toggleAudio = () => {
    const { isPlaying } = this.state;
    const {
      id,
      onTogglePlay,
    } = this.props;
  
    if (this.controlled) {
      onTogglePlay(id, isPlaying);
    } else {
      if (!isPlaying) {
        this.playAudio();
      } else {
        this.pauseAudio();
      }
    }
  }


  // play button has been clicked
  playAudio = () => {
    const {
      id,
      onPlay,
    } = this.props;

    this.setState({ isPlaying: true }, () => {
      this.audio.current.play();
      if (!this.audioTimeUpdating) {
        this.audioTimeUpdating = window.requestAnimationFrame(this.updateLoop);
      }
      onPlay(id);
    });
  }

  // pause button has been clicked
  pauseAudio = () => {
    const {
      id,
      onEnd,
    } = this.props;

    this.setState({ isPlaying: false }, () => {
      this.audio.current.pause();
      window.cancelAnimationFrame(this.audioTimeUpdating);
      this.audioTimeUpdating = null;
      onEnd(id);
    });
  }

  updateLoop = () => {
    this.updateTime();
    this.audioTimeUpdating = window.requestAnimationFrame(this.updateLoop);
  }

  // set current time to formatted audio current time
  updateTime = (callback) => {
    this.setState({
      timePlayed    : formatTime(this.audio.current.currentTime),
      timeLeft      : `-${formatTime(Math.floor(this.audio.current.duration) - Math.floor(this.audio.current.currentTime))}`,
      percentPlayed : roundNumber(100 * (this.audio.current.currentTime / this.audio.current.duration), 4),
    }, () => {
      if (typeof (callback) === 'function') {
        callback();
      }
    });
  }

  scrubAudio = (inputValue) => {
    const newTime = this.getNewPlayerCurrentTime(inputValue);

    if (!isNaN(newTime)) {
      this.audio.current.currentTime = newTime;
      this.updateTime();
    }
  }

  startScrubbing = () => {
    const { isPlaying } = this.state;

    if (isPlaying) {
      this.audio.current.pause();
    }
  }

  doneScrubbing = (e) => {
    const { isPlaying } = this.state;
    const newTime = this.getNewPlayerCurrentTime(e.target.value);

    if (!isNaN(newTime)) {
      this.audio.current.currentTime = newTime;
      this.updateTime(() => {
        if (isPlaying) {
          this.audio.current.play();
        }
      });
    }
  }

  handleKeyboard = (e) => {
    const {
      isEnter,
      isSpace,
    } = convertKeyCode(e);
    if (isEnter || isSpace) {
      this.toggleAudio();
    }
  }

  renderAudioTime(time) {
    const {
      playerTime: PlayerTime,
      showTimestamps,
    } = this.props;

    if (showTimestamps) {
      return <PlayerTime time={ time } />;
    }

    return null;
  }

  render() {
    const {
      id,
      onEnd,
      onPlay,
      onTogglePlay,
      playAudio,
      playerTime,
      playIcon: PlayIcon,
      progressColor,
      showTimestamps,
      sources,
      trackBar: TrackBar,
      trackColor,
      ...props
    } = this.props;
    const {
      isPlaying,
      percentPlayed,
      timeLeft,
      timePlayed,
    } = this.state;

    return (
      <div { ...props }>
        <audio
          id={id}
          ref={this.audio}
          onEnded={this.onAudioEnded}
        >
          {sources.map(renderAudioSource)}
        </audio>
        <AudioControls>
          <AudioPlayBtn onClick={ this.toggleAudio }>
            <PlayIcon isPlaying={ isPlaying } />
          </AudioPlayBtn>
          <AudioTimeline>
            {this.renderAudioTime(timePlayed)}
            <TrackBar
              id={ `${id}-trackbar` }
              onChange={ this.scrubAudio }
              onKeyDown={ this.handleKeyboard }
              onMouseDown={ this.startScrubbing }
              onMouseUp={ this.doneScrubbing }
              value={ percentPlayed }
            />
            {this.renderAudioTime(timeLeft)}
          </AudioTimeline>
        </AudioControls>
      </div>
    );
  }
}

AudioPlayer.defaultProps = {
  onEnd          : () => {},
  onPlay         : () => {},
  onTogglePlay   : () => {},
  playerTime     : AudioPlayerTime,
  playIcon       : AudioPlayerIcon,
  showTimestamps : true,
  trackBar       : AudioPlayerTrackBar,
};

AudioPlayer.propTypes = {
  id             : PropTypes.string.isRequired,
  onEnd          : PropTypes.func,
  onPlay         : PropTypes.func,
  onTogglePlay   : PropTypes.func,
  playAudio      : PropTypes.bool,
  playIcon       : PropTypes.func,
  showTimestamps : PropTypes.bool,
  sources        : PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
  trackBar       : PropTypes.any,
};

export default AudioPlayer;
