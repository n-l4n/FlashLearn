import {ScrollView, StyleSheet, View} from 'react-native';
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
import React, {createRef} from 'react';
import {useDeckCardBaseState} from '../../../../BaseState';
import {appColors} from '../../../../theme';
import {BaseDeckScreen} from '../base/BaseDeckScreen';
import Camera from '../component/Camera';
import TrackPlayer from 'react-native-track-player';
import AudioRecorder from '../component/AudioRecorder';
import FileUploadHelper from '../../../../db/FileUploadHelper';
import DeckAnswerList from '../component/DeckAnswerList';

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
          value={baseCardState.answer}
          onChangeText={text => baseCardState.setAnswer(text)}
          style={styles.textInput}
        />
        <View style={styles.buttonContainer}>
          <FAB
            visible={!baseCardState.isTakingPicture}
            loading={baseCardState.isUploadingPicture}
            disabled={isHandlingMedia(baseCardState)}
            small
            icon="camera"
            onPress={() => baseCardState.setIsTakingPicture(true)}
          />
          <FAB
            visible={!baseCardState.isTakingPicture}
            loading={
              baseCardState.isRecordingAudio || baseCardState.isUploadingAudio
            }
            disabled={isHandlingMedia(baseCardState)}
            small
            icon="microphone"
            onPress={() => ref.startRecording(baseCardState)}
          />
          <FAB
            visible={!baseCardState.isTakingPicture}
            small
            icon="format-list-bulleted-square"
            disabled={
              isHandlingMedia(baseCardState) || baseCardState.isAddingListItems
            }
            onPress={() => baseCardState.setIsAddingListItems(true)}
          />
          <FAB
            visible={!baseCardState.isTakingPicture}
            small
            icon="format-list-checks"
            disabled={isHandlingMedia(baseCardState)}
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
        {baseCardState.isAddingListItems && (
          <View style={styles.subSection}>
            <Divider />
            <Caption style={styles.subSectionHint}>ANTWORTEN</Caption>
            <DeckAnswerList
              isEditing={true}
              items={baseCardState.listItems}
              onNewItem={item => {
                baseCardState.setListItems([...baseCardState.listItems, item]);
              }}
              onDelete={item => {
                let items = baseCardState.listItems.slice();
                items = items.filter(foundItem => item !== foundItem);
                baseCardState.setListItems(items);
              }}
              style={styles.subSectionContent}
            />
          </View>
        )}
        {baseCardState.picture && (
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
        {baseCardState.recording && (
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
        disabled={isHandlingMedia(baseCardState)}
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
      baseCardState.setPicture(url);
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
      baseCardState.setRecording(url);
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

function isHandlingMedia(baseCardState) {
  return (
    baseCardState.isUploadingPicture ||
    baseCardState.isUploadingAudio ||
    baseCardState.isRecordingAudio
  );
}

export function NewDeckCardScreen({route, navigation}) {
  const baseCardState = useDeckCardBaseState();
  baseCardState.picture = baseCardState.card.picture;
  baseCardState.recording = baseCardState.card.recording;
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
