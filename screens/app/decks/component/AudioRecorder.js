import React from 'react';
import {IconButton} from 'react-native-paper';
import {PermissionsAndroid, View} from 'react-native';
import SoundRecorder from 'react-native-sound-recorder';

export default class AudioRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
    };
  }

  async startRecording() {
    const granted = PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
    if (granted) {
      this.startRecordingImpl();
      return;
    }
    const grantRequestResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Mikrofon Berechtigung',
        message:
          'Die Mikrofon Berechtigung wird benötigt um eine Aufnahme zu machen.',
        buttonNeutral: 'Später',
        buttonNegative: 'Abbrechen',
        buttonPositive: 'OK',
      },
    );

    if (grantRequestResult === PermissionsAndroid.RESULTS.GRANTED) {
      this.startRecordingImpl();
    }
  }

  startRecordingImpl() {
    this.props.onStartRecording();
    this.setState({
      isRecording: true,
    });
    SoundRecorder.start(SoundRecorder.PATH_CACHE + '/curr_recording.mp3').then(
      () => console.log('started recording'),
    );
  }

  stopRecording() {
    this.setState({
      isRecording: false,
    });
    SoundRecorder.stop().then(async result => {
      this.props.onStopRecording(result.path);
    });
  }

  render() {
    return (
      <>
        <IconButton
          icon="stop"
          size={32}
          onPress={() => {
            this.stopRecording();
          }}
        />
      </>
    );
  }
}
