import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  throttle,
} from 'lodash';

import {
  convertKeyCode,
  formatTime,
  roundNumber,
} from '../../utilities';
import AudioTrackBar from './trackBar';
import AudioPlayIcon from './playIcon';
import {
  AudioControls,
  AudioPlayBtn,
  AudioRangeTrackWrapper,
  AudioTime,
  AudioTimeline,
} from './styles';

function renderAudioSource(source, idx) {
  return <source key={ `src-${idx}` } src={ source.url } type={ `audio/${source.type}` } />;
}

/**
 * Audio Component
 * @param { string } - provide the audio file
 * @return - the audio tag with all related functionality scoped to this instance
 */
export default class AudioPlayer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying     : false,
      timeLeft      : '00:00',
      timePlayed    : '00:00',
      percentPlayed : 0,
    };

    this.audio = React.createRef();
  }

  componentDidMount() {
    // Add listeners for audio file
    this.audio.current.addEventListener('canplaythrough', this.updateTime);
    this.audio.current.addEventListener('loadedmetadata', this.updateTime);
    this.audio.current.addEventListener('timeupdate', throttle(this.updateTime, 30));
    this.audio.current.addEventListener('ended', this.onAudioEnded);
  }

  componentWillUnmount() {
    // Clear listeners for audio
    this.audio.current.removeEventListener('canplaythrough', this.updateTime);
    this.audio.current.removeEventListener('loadedmetadata', this.updateTime);
    this.audio.current.removeEventListener('timeupdate', this.updateTime);
    this.audio.current.removeEventListener('ended', this.onAudioEnded);
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

    if (isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }


  // play button has been clicked
  playAudio = () => {
    const {
      id,
      onPlay,
    } = this.props;

    onPlay(id);
    this.setState({ isPlaying: true });
    this.audio.current.play();
  }

  // pause button has been clicked
  pauseAudio = () => {
    this.setState({ isPlaying: false });
    this.audio.current.pause();
  }

  // set current time to formatted audio current time
  updateTime = (callback) => {
    this.setState({
      timePlayed    : formatTime(this.audio.current.currentTime),
      timeLeft      : `-${formatTime(Math.floor(this.audio.current.duration) - Math.floor(this.audio.current.currentTime))}`,
      percentPlayed : roundNumber(100 * (this.audio.current.currentTime / this.audio.current.duration), 0),
    }, () => {
      if (typeof (callback) === 'function') {
        callback();
      }
    });
  }

  scrubAudio = (e) => {
    this.audio.current.currentTime = this.getNewPlayerCurrentTime(e.target.value);
    this.updateTime();
  }

  startScrubbing = () => {
    const { isPlaying } = this.state;

    if (isPlaying) {
      this.audio.current.pause();
    }
  }

  doneScrubbing = (e) => {
    const { isPlaying } = this.state;

    this.audio.current.currentTime = this.getNewPlayerCurrentTime(e.target.value);
    this.updateTime(() => {
      if (isPlaying) {
        this.audio.current.play();
      }
    });
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

  renderTime(time) {
    const { showTimestamps } = this.props;

    if (showTimestamps) {
      return (
        <AudioTime className="Audio-time">
          {time}
        </AudioTime>
      );
    }

    return null;
  }

  render() {
    const {
      className,
      id,
      onEnd,
      onPlay,
      playIcon: PlayIcon,
      progressColor,
      showTimestamps,
      sources,
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
      <div className={ `Audio ${className}` } { ...props }>
        <audio id={id} className="Audio-track" ref={this.audio}>
          {sources.map(renderAudioSource)}
        </audio>
        <AudioControls className="Audio-controls">
          <AudioPlayBtn className="Audio-playBtn" onClick={ this.toggleAudio }>
            <PlayIcon isPlaying={ isPlaying } />
          </AudioPlayBtn>
          <AudioTimeline className="Audio-timeline">
            <AudioTime className="Audio-time Audio-time--current">
              {this.renderTime(timePlayed)}
            </AudioTime>
            <AudioRangeTrackWrapper>
              <AudioTrackBar
                id={ `${id}-trackbar` }
                onChange={ this.scrubAudio }
                onKeyDown={ this.handleKeyboard }
                onMouseDown={ this.startScrubbing }
                onMouseUp={ this.doneScrubbing }
                progressColor={ progressColor }
                trackColor={ trackColor }
                value={ percentPlayed }
              />
            </AudioRangeTrackWrapper>
            {this.renderTime(timeLeft)}
          </AudioTimeline>
        </AudioControls>
      </div>
    );
  }
}

AudioPlayer.defaultProps = {
  onEnd          : () => {},
  onPlay         : () => {},
  playIcon       : AudioPlayIcon,
  progressColor  : '#999',
  showTimestamps : true,
  trackColor     : '#D8D8D8',
};

AudioPlayer.propTypes = {
  id             : PropTypes.string.isRequired,
  onEnd          : PropTypes.func,
  onPlay         : PropTypes.func,
  playIcon       : PropTypes.func,
  progressColor  : PropTypes.string,
  showTimestamps : PropTypes.bool,
  sources        : PropTypes.arrayOf(PropTypes.object).isRequired,
  trackColor     : PropTypes.string,
};
