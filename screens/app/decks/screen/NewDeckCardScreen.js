import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import Image from 'react-native-scalable-image';
import {authStyles} from '../../../auth/AuthStyles';
import {
  Appbar,
  Caption,
  Divider,
  FAB,
  IconButton,
  TextInput,
} from 'react-native-paper';
import {globalStyles} from '../../../../GlobalStyles';
import React, {useState, useEffect} from 'react';
import {useDeckCardBaseState} from '../../../../BaseState';
import {appColors} from '../../../../theme';
import {useLoadDeck} from '../../../../db/DeckLoadHelper';
import {BaseDeckScreen} from '../base/BaseDeckScreen';
import Camera from '../component/Camera';
import storage from '@react-native-firebase/storage';
import TrackPlayer from 'react-native-track-player';
import SoundRecorder from 'react-native-sound-recorder';

const styles = StyleSheet.create({
  textInput: {
    margin: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 8,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10000,
  },
  subSection: {
    marginVertical: 16,
  },
  subSectionContent: {
    alignSelf: 'center',
  },
  subSectionHint: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

function NewDeckCardScreenImpl(baseState, baseCardState, navigation) {
  console.log(baseCardState.card);
  return (
    <>
      <ScrollView>
        <TextInput
          left={
            <TextInput.Icon
              color={appColors.textIconColor}
              name="help-circle"
            />
          }
          label="Frage"
          value={baseCardState.question}
          onChangeText={text => baseCardState.setQuestion(text)}
          style={styles.textInput}
        />
        <Divider />
        <TextInput
          left={
            <TextInput.Icon
              color={appColors.textIconColor}
              name="alert-circle"
            />
          }
          label="Antwort"
          value={baseCardState.question}
          onChangeText={text => baseCardState.setQuestion(text)}
          style={styles.textInput}
        />
        <View style={styles.buttonContainer}>
          <FAB
            visible={!baseCardState.isTakingPicture}
            loading={baseCardState.isUploadingPicture}
            disabled={baseCardState.isUploadingPicture}
            small
            icon="camera"
            onPress={() => baseCardState.setIsTakingPicture(true)}
          />
          <FAB
            visible={!baseCardState.isTakingPicture}
            loading={
              baseCardState.isRecordingAudio || baseCardState.isUploadingAudio
            }
            disabled={
              baseCardState.isRecordingAudio || baseCardState.isUploadingAudio
            }
            small
            icon="microphone"
            onPress={() => startRecording(baseCardState)}
          />
          <FAB
            visible={!baseCardState.isTakingPicture}
            small
            icon="format-list-bulleted-square"
            onPress={() => console.log('Pressed')}
          />
          <FAB
            visible={!baseCardState.isTakingPicture}
            small
            icon="format-list-checks"
            onPress={() => console.log('Pressed')}
          />
        </View>
        {baseCardState.isRecordingAudio && (
          <View style={styles.subSection}>
            <Divider />
            <Caption style={styles.subSectionHint}>AUFNAHME STEUERN</Caption>
            <IconButton
              icon="stop"
              size={32}
              onPress={() => {
                stopRecording(baseState, baseCardState);
              }}
            />
          </View>
        )}
        {'picture' in baseCardState.card &&
          baseCardState.card.picture !== null && (
            <View style={styles.subSection}>
              <Divider />
              <Caption style={styles.subSectionHint}>BILD</Caption>
              <Image
                source={{
                  uri: baseCardState.card.picture,
                }}
                width={150}
                resizeMode="contain"
                style={styles.subSectionContent}
              />
            </View>
          )}
        {'recording' in baseCardState.card &&
          baseCardState.card.recording !== null && (
            <View style={styles.subSection}>
              <Divider />
              <Caption style={styles.subSectionHint}>AUFNAHME</Caption>
              <IconButton
                icon="play"
                size={32}
                onPress={() => {
                  startPlayback(baseCardState);
                }}
              />
            </View>
          )}
      </ScrollView>
      {baseCardState.isTakingPicture && (
        <Camera
          style={styles.fullScreen}
          onPicture={uri => onPictureTaken(baseState, baseCardState, uri)}
          onCancel={() => baseCardState.setIsTakingPicture(false)}
        />
      )}
      <FAB
        style={globalStyles.fab}
        visible={!baseCardState.isTakingPicture}
        icon="check"
        onPress={() => {}}
      />
    </>
  );
}

async function onPictureTaken(baseState, baseCardState, uri) {
  baseCardState.setIsTakingPicture(false);
  baseCardState.setIsUploadingPicture(true);
  const fileRef = storage().ref(
    'deck_data/' + baseState.deck.id + '/' + baseCardState.card.id + '.jpg',
  );
  const task = fileRef.putFile(uri);
  await task.then(async () => {
    baseCardState.setIsUploadingPicture(false);
    baseCardState.card.picture = await fileRef.getDownloadURL();
    baseCardState.setCard(baseCardState.card);
  });
}

async function startPlayback(baseCardState) {
  await TrackPlayer.setupPlayer();

  await TrackPlayer.add({
    id: 'recording',
    url: baseCardState.card.recording,
    title: 'Aufnahme',
  });

  await TrackPlayer.play();
}

async function startRecording(baseCardState) {
  const granted = PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  );
  if (granted) {
    startRecordingImpl(baseCardState);
  }
  const grantRequestResult = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
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
    startRecordingImpl(baseCardState);
  }
}

function startRecordingImpl(baseCardState) {
  baseCardState.setIsRecordingAudio(true);
  SoundRecorder.start(SoundRecorder.PATH_CACHE + '/curr_recording.mp3').then(
    () => console.log('started recording'),
  );
}

function stopRecording(baseState, baseCardState) {
  baseCardState.setIsRecordingAudio(false);
  baseCardState.setIsUploadingAudio(true);
  SoundRecorder.stop().then(async result => {
    const fileRef = storage().ref(
      'deck_data/' + baseState.deck.id + '/' + baseCardState.card.id + '.mp3',
    );
    const task = fileRef.putFile(result.path);
    await task.then(async () => {
      baseCardState.setIsUploadingAudio(false);
      baseCardState.card.recording = await fileRef.getDownloadURL();
      baseCardState.setCard(baseCardState.card);
    });
  });
}

function NewDeckCardScreenAppbarImpl(baseState, navigation) {
  return (
    <Appbar.Header style={authStyles.appBar}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title="Neue Karte" />
    </Appbar.Header>
  );
}

export function NewDeckCardScreen({route, navigation}) {
  const baseCardState = useDeckCardBaseState();
  return BaseDeckScreen(
    route,
    navigation,
    baseState => {
      return NewDeckCardScreenImpl(baseState, baseCardState, navigation);
    },
    baseState => {
      return NewDeckCardScreenAppbarImpl(baseState, navigation);
    },
  );
}
