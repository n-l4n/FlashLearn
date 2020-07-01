import React from 'react';
import {IconButton} from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';

export default class AudioPlayer extends React.Component {
  playerStateChanges;

  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
    };
    TrackPlayer.setupPlayer().then(() => {
      console.log('Player is ready');
    });
  }

  render() {
    return (
      <IconButton
        icon={this.state.isPlaying ? 'pause' : 'play'}
        size={32}
        onPress={() => {
          this.state.isPlaying
            ? this.stopAndCleanPlayback()
            : this.startPlayback();
        }}
      />
    );
  }

  componentWillUnmount(): void {
    this.cleanUpAfterPlayback();
  }

  async startPlayback() {
    await TrackPlayer.setupPlayer();

    TrackPlayer.updateOptions({
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
      ],
    });

    await TrackPlayer.add({
      id: 'recording',
      url: this.props.recording,
      title: 'Aufnahme',
    });

    this.playerStateChanges = TrackPlayer.addEventListener(
      'playback-state',
      state => {
        console.log(state);
      },
    );

    await TrackPlayer.play();

    this.setState({
      isPlaying: true,
    });
  }

  stopAndCleanPlayback() {
    this.stopPlayback();
    this.cleanUpAfterPlayback();
  }

  stopPlayback() {
    TrackPlayer.destroy();
  }

  cleanUpAfterPlayback() {
    if (this.playerStateChanges) {
      this.playerStateChanges.remove();
      this.playerStateChanges = null;
    }
    this.setState({
      isPlaying: false,
    });
  }
}
