import React from 'react';
import {IconButton, Title} from 'react-native-paper';
import {Animated, PermissionsAndroid, StyleSheet, View} from 'react-native';
import SoundRecorder from 'react-native-sound-recorder';

export default class AudioRecorder extends React.Component {
  styles = StyleSheet.create({
    contentContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  timerId: number;

  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      recordingSeconds: 0,
      animSize: new Animated.Value(20),
    };
  }

  componentWillUnmount(): void {
    this.stopRecordingTimer();
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
      () => {
        this.startRecordingTimer();
      },
    );
  }

  startRecordingTimer() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.animSize, {
          toValue: 28,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(this.state.animSize, {
          toValue: 20,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ).start();

    this.timerId = setInterval(() => {
      this.setState({
        recordingSeconds: this.state.recordingSeconds + 1,
      });
    }, 1000);
  }

  stopRecordingTimer() {
    clearInterval(this.timerId);
  }

  stopRecording() {
    this.setState({
      isRecording: false,
    });
    SoundRecorder.stop().then(async result => {
      this.props.onStopRecording(result.path);
    });
  }

  getRecordingSecondsAsReadableString() {
    const mins = Math.round(this.state.recordingSeconds / 60);
    const seconds = Math.round(this.state.recordingSeconds % 60);
    return mins + ':' + (seconds >= 10 ? seconds : '0' + seconds);
  }

  render() {
    return (
      <View style={this.styles.contentContainer}>
        <View
          style={{
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
            marginEnd: 8,
          }}>
          <Animated.View
            style={{
              width: this.state.animSize,
              height: this.state.animSize,
              borderRadius: 16,
              backgroundColor: '#d32f2f',
              alignSelf: 'center',
            }}
          />
        </View>
        <Title>{this.getRecordingSecondsAsReadableString()}</Title>
        <IconButton
          icon="stop"
          size={32}
          onPress={() => {
            this.stopRecording();
          }}
        />
      </View>
    );
  }
}
