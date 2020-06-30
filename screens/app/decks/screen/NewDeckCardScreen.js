import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import Image from 'react-native-scalable-image';
import {authStyles} from '../../../auth/AuthStyles';
import {
  Appbar,
  Caption,
  Divider,
  FAB,
  IconButton,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import {globalStyles} from '../../../../GlobalStyles';
import React, {createRef} from 'react';
import {BaseCardState} from '../../../../BaseState';
import {appColors} from '../../../../theme';
import {BaseDeckScreen} from '../base/BaseDeckScreen';
import Camera from '../component/Camera';
import TrackPlayer from 'react-native-track-player';
import AudioRecorder from '../component/AudioRecorder';
import FileUploadHelper from '../../../../db/FileUploadHelper';
import DeckAnswerList from '../component/DeckAnswerList';
import DeckMultipleChoiceList from '../component/DeckMultipleChoiceList';
import {DeckCrudHelper} from '../../../../db/DeckCrudHelper';

export class NewDeckCardScreen extends BaseDeckScreen {
  styles = StyleSheet.create({
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
  audioRecorderRef;

  onDeckLoaded(deck) {
    const cardId = this.getNavigationParam('cardId');
    if (cardId !== 'new') {
      this.state.card = deck.cards.find(item => item.id === cardId);
      if (this.state.card.question) {
        this.state.question = this.state.card.question;
      }
      if (this.state.card.answer) {
        this.state.answer = this.state.card.answer;
      }
      if (this.state.card.picture) {
        this.state.picture = this.state.card.picture;
      }
      if (this.state.card.recording) {
        this.state.recording = this.state.card.recording;
      }
      if (this.state.card.list.length > 0) {
        this.state.isAddingListItems = true;
        this.state.listItems = this.state.card.list;
      }
      if (this.state.card.multipleChoiceItems.length > 0) {
        this.state.isAddingMultipleChoiceItems = true;
        this.state.multipleChoiceItems = this.state.card.multipleChoiceItems;
      }
    }
  }

  buildCustomState(): {} {
    return new BaseCardState();
  }

  buildAppbar() {
    return (
      <Appbar.Header style={authStyles.appBar}>
        <Appbar.BackAction onPress={() => this.navigation.goBack()} />
        <Appbar.Content title="Neue Karte" />
        {this.getNavigationParam('cardId') !== 'new' && (
          <Appbar.Action icon={'delete'} onPress={() => this.deleteCard()} />
        )}
      </Appbar.Header>
    );
  }

  buildContent() {
    this.audioRecorderRef = createRef();

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
            value={this.state.question}
            onChangeText={text => this.setState({question: text})}
            style={this.styles.textInput}
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
            value={this.state.answer}
            onChangeText={text => this.setState({answer: text})}
            style={this.styles.textInput}
          />
          <View style={this.styles.buttonContainer}>
            <FAB
              visible={!this.state.isTakingPicture}
              loading={this.state.isUploadingPicture}
              disabled={this.isHandlingMedia()}
              small
              icon="camera"
              onPress={() => this.setState({isTakingPicture: true})}
            />
            <FAB
              visible={!this.state.isTakingPicture}
              loading={
                this.state.isRecordingAudio || this.state.isUploadingAudio
              }
              disabled={this.isHandlingMedia()}
              small
              icon="microphone"
              onPress={() => this.audioRecorderRef.startRecording()}
            />
            <FAB
              visible={!this.state.isTakingPicture}
              small
              icon="format-list-bulleted-square"
              disabled={this.isHandlingMedia() || this.state.isAddingListItems}
              onPress={() => this.setState({isAddingListItems: true})}
            />
            <FAB
              visible={!this.state.isTakingPicture}
              small
              icon="format-list-checks"
              disabled={
                this.isHandlingMedia() || this.state.isAddingMultipleChoiceItems
              }
              onPress={() => this.setState({isAddingMultipleChoiceItems: true})}
            />
          </View>
          <View
            style={[
              this.styles.subSection,
              !this.state.isRecordingAudio ? this.styles.hidden : null,
            ]}>
            <Divider />
            <Caption style={this.styles.subSectionHint}>
              AUFNAHME STEUERN
            </Caption>
            <AudioRecorder
              ref={recorder => {
                this.audioRecorderRef = recorder;
              }}
              onStartRecording={() => this.onRecordingStart()}
              onStopRecording={path => this.onRecordingStop(path)}
            />
          </View>
          {this.state.isAddingListItems && (
            <View style={this.styles.subSection}>
              <Divider />
              <Caption style={this.styles.subSectionHint}>ANTWORTEN</Caption>
              <DeckAnswerList
                isEditing={true}
                items={this.state.listItems}
                onNewItem={item => {
                  this.setState({
                    listItems: [...this.state.listItems, item],
                  });
                }}
                onDelete={item => {
                  let items = this.state.listItems.slice();
                  items = items.filter(foundItem => item !== foundItem);
                  this.setState({listItems: items});
                }}
                style={this.styles.subSectionContent}
              />
            </View>
          )}
          {this.state.isAddingMultipleChoiceItems && (
            <View style={this.styles.subSection}>
              <Divider />
              <Caption style={this.styles.subSectionHint}>
                MULTIPLE CHOICE
              </Caption>
              <DeckMultipleChoiceList
                isEditing={true}
                items={this.state.multipleChoiceItems}
                onNewItem={item => {
                  this.setState({
                    multipleChoiceItems: [
                      ...this.state.multipleChoiceItems,
                      item,
                    ],
                  });
                }}
                onDelete={item => {
                  let items = this.state.multipleChoiceItems.slice();
                  items = items.filter(foundItem => item !== foundItem);
                  this.setState({multipleChoiceItems: items});
                }}
                style={this.styles.subSectionContent}
              />
            </View>
          )}
          {this.state.picture && (
            <View style={this.styles.subSection}>
              <Divider />
              <Caption style={this.styles.subSectionHint}>BILD</Caption>
              <Image
                source={{
                  uri: this.state.picture,
                }}
                width={150}
                resizeMode="contain"
                style={this.styles.subSectionContent}
              />
            </View>
          )}
          {this.state.recording && (
            <View style={this.styles.subSection}>
              <Divider />
              <Caption style={this.styles.subSectionHint}>AUFNAHME</Caption>
              <IconButton
                icon="play"
                size={32}
                onPress={() => {
                  this.startPlayback();
                }}
                style={this.styles.subSectionContent}
              />
            </View>
          )}
        </ScrollView>
        {this.state.isTakingPicture && (
          <Camera
            style={this.styles.fullScreen}
            onPicture={uri => this.onPictureTaken(uri)}
            onCancel={() =>
              this.setState({
                isTakingPicture: false,
              })
            }
          />
        )}
        <Snackbar visible={this.getError()} onDismiss={() => this.setError()}>
          Beim Hinzufügen ist etwas schief gelaufen.
        </Snackbar>
        <FAB
          style={globalStyles.fab}
          visible={!this.state.isTakingPicture}
          icon="check"
          disabled={this.isHandlingMedia() || this.state.loading}
          loading={this.state.loading}
          onPress={() => this.save()}
        />
      </>
    );
  }

  async onPictureTaken(uri) {
    this.setState({
      isTakingPicture: false,
      isUploadingPicture: true,
    });
    await FileUploadHelper.uploadFile(
      uri,
      'deck_data/' + this.state.deck.id + '/' + this.state.card.id + '.jpg',
      url => {
        if (url === null) {
          return;
        }
        this.setState({
          isUploadingPicture: false,
          picture: url,
        });
      },
    );
  }

  onRecordingStart() {
    this.setState({
      isRecordingAudio: true,
    });
  }

  async onRecordingStop(path) {
    this.setState({
      isRecordingAudio: false,
      isUploadingAudio: true,
    });
    await FileUploadHelper.uploadFile(
      path,
      'deck_data/' + this.state.deck.id + '/' + this.state.card.id + '.mp3',
      url => {
        if (url === null) {
          return;
        }
        this.setState({
          isUploadingAudio: false,
          recording: url,
        });
      },
    );
  }

  async startPlayback() {
    await TrackPlayer.setupPlayer();

    await TrackPlayer.add({
      id: 'recording',
      url: this.state.recording,
      title: 'Aufnahme',
    });

    await TrackPlayer.play();
  }

  isHandlingMedia() {
    return (
      this.state.isUploadingPicture ||
      this.state.isUploadingAudio ||
      this.state.isRecordingAudio
    );
  }

  deleteCard() {
    const deck = this.state.deck;
    const card = this.state.card;
    DeckCrudHelper.deleteCardInDeck(deck, card, success => {
      this.navigation.goBack();
    });
  }

  save() {
    if (
      !this.state.question ||
      this.state.question.length === 0 ||
      !this.state.answer ||
      this.state.answer === 0
    ) {
      this.setError('input-err');
      return;
    }
    const deck = this.state.deck;
    const cardId = this.getNavigationParam('cardId');
    const card = this.state.card;

    card.question = this.state.question;
    card.answer = this.state.answer;
    card.picture = this.state.picture;
    card.recording = this.state.recording;
    card.list = this.state.listItems;
    card.multipleChoiceItems = this.state.multipleChoiceItems;

    if (cardId === 'new') {
      DeckCrudHelper.addCardToDeck(deck, card, success => {
        this.navigation.goBack();
      });
    } else {
      DeckCrudHelper.updateCardInDeck(deck, card, success => {
        this.navigation.goBack();
      });
    }

    this.setState({
      loading: true,
    });
  }
}
