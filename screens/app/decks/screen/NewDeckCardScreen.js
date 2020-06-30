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
import React, {useState, useEffect, createRef} from 'react';
import {useDeckCardBaseState} from '../../../../BaseState';
import {appColors} from '../../../../theme';
import {useLoadDeck} from '../../../../db/DeckLoadHelper';
import {BaseDeckScreen} from '../base/BaseDeckScreen';
import Camera from '../component/Camera';
import storage from '@react-native-firebase/storage';
import TrackPlayer from 'react-native-track-player';
import SoundRecorder from 'react-native-sound-recorder';
import AudioRecorder from '../component/AudioRecorder';
import FileUploadHelper from '../../../../db/FileUploadHelper';

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
  hidden: {
    opacity: 0,
    height: 0,
  },
});

function NewDeckCardScreenImpl(baseState, baseCardState, navigation) {
  console.log(baseCardState.card);
  console.log(
    'picture' in baseCardState.card && baseCardState.card.picture !== null,
  );
  let ref = createRef();

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
            onPress={() => ref.startRecording(baseCardState)}
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
        <View
          style={[
            styles.subSection,
            !baseCardState.isRecordingAudio ? styles.hidden : null,
          ]}>
          <Divider />
          <Caption style={styles.subSectionHint}>AUFNAHME STEUERN</Caption>
          <AudioRecorder
            ref={recorder => {
              ref = recorder;
            }}
            onStartRecording={() => onRecordingStart(baseCardState)}
            onStopRecording={path =>
              onRecordingStop(path, baseState, baseCardState)
            }
          />
        </View>
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
                style={styles.subSectionContent}
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
  await FileUploadHelper.uploadFile(
    uri,
    'deck_data/' + baseState.deck.id + '/' + baseCardState.card.id + '.jpg',
    url => {
      if (url === null) {
        return;
      }
      baseCardState.setIsUploadingPicture(false);
      baseCardState.card.picture = url;
      baseCardState.setCard(baseCardState.card);
    },
  );
}

function onRecordingStart(baseCardState) {
  baseCardState.setIsRecordingAudio(true);
}

async function onRecordingStop(path, baseState, baseCardState) {
  baseCardState.setIsRecordingAudio(false);
  baseCardState.setIsUploadingAudio(true);
  await FileUploadHelper.uploadFile(
    path,
    'deck_data/' + baseState.deck.id + '/' + baseCardState.card.id + '.mp3',
    url => {
      if (url === null) {
        return;
      }
      baseCardState.setIsUploadingAudio(false);
      baseCardState.card.recording = url;
      baseCardState.setCard(baseCardState.card);
    },
  );
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
