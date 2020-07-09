import {BaseDeckScreen} from '../base/BaseDeckScreen';
import {
  Appbar,
  Button,
  Caption,
  Card,
  Divider,
  FAB,
  Modal,
  Portal,
  Text,
  TextInput,
  Title,
} from 'react-native-paper';
import {authStyles} from '../../../auth/AuthStyles';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import DeckMultipleChoiceList from '../component/DeckMultipleChoiceList';
import AudioPlayer from '../component/AudioPlayer';
import DeckAnswerList from '../component/DeckAnswerList';
import Image from 'react-native-scalable-image';
import {DeckCrudHelper} from '../../../../db/DeckCrudHelper';
import {appColors} from '../../../../../../theme';
import {AuthHelper} from '../../../../db/AuthHelper';

export default class LearnScreen extends BaseDeckScreen {
  styles = StyleSheet.create({
    card: {
      margin: 8,
    },
    actionContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 8,
    },
    correct: {
      backgroundColor: '#4caf50',
    },
    wrong: {
      backgroundColor: '#d32f2f',
    },
    turn: {
      backgroundColor: '#000000',
    },
    positionIndicatorContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    subSection: {
      marginVertical: 8,
    },
    subSectionContent: {
      alignSelf: 'center',
    },
    subSectionHint: {
      marginVertical: 8,
      marginHorizontal: 16,
    },
    modal: {
      margin: 8,
    },
    modalInput: {
      marginVertical: 16,
    },
  });
  box: number;
  count: number;
  updatedBoxStates = {};

  buildCustomState(): {} {
    return {
      cards: [],
      currentCardIndex: 0,
      isShowingQuestion: true,
      complaintModalVisible: false,
      complaintMessage: '',
    };
  }

  onDeckLoaded(deck) {
    if (this.state.cards.length > 0) {
      return;
    }
    this.box = this.getNavigationParam('box');
    this.count = this.getNavigationParam('count');

    if (this.box !== -1) {
      this.state.cards = this.getRandom(
        deck.cards.filter(card => card.getCurrentBoxForUser() === this.box),
        this.count,
      );
    } else {
      this.state.cards = this.getRandom(deck.cards, this.count);
    }
  }

  onCorrectAnswer() {
    const card = this.state.cards[this.state.currentCardIndex];
    const currentBox = card.getCurrentBoxForUser();
    if (currentBox < 4) {
      this.updatedBoxStates[card.id] = currentBox + 1;
      this.nextCard();
    } else {
      this.nextCard();
    }
  }

  onWrongAnswer() {
    const card = this.state.cards[this.state.currentCardIndex];
    this.updatedBoxStates[card.id] = 0;
    this.nextCard();
  }

  updateDeckOnExit() {
    for (const id in this.updatedBoxStates) {
      const index = this.state.deck.cards.findIndex(card => card.id === id);
      if (index === -1) {
        continue;
      }
      this.state.deck.cards[index].setCurrentBoxForUser(
        this.updatedBoxStates[id],
      );
    }
    DeckCrudHelper.updateDeck(this.state.deck, success => {});
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.updateDeckOnExit();
  }

  nextCard() {
    if (this.state.currentCardIndex + 1 >= this.state.cards.length) {
      this.navigation.goBack();
    } else {
      this.setState({
        currentCardIndex: this.state.currentCardIndex + 1,
        isShowingQuestion: true,
      });
    }
  }

  buildAppbar() {
    return (
      <Appbar.Header style={authStyles.appBar}>
        <Appbar.BackAction onPress={() => this.navigation.goBack()} />
        <Appbar.Content title="Lernen" />
        {this.state.deck.ownerId !== AuthHelper.userId() && (
          <Appbar.Action
            icon="alert-decagram"
            onPress={() => {
              this.showModal();
            }}
          />
        )}
      </Appbar.Header>
    );
  }

  showModal() {
    this.setState({
      complaintModalVisible: true,
    });
  }

  hideModal() {
    this.setState({
      complaintModalVisible: false,
      complaintMessage: '',
    });
  }

  sendComplaint() {
    DeckCrudHelper.sendDeckComplaint(
      this.state.deck,
      this.state.cards[this.state.currentCardIndex],
      this.state.complaintMessage,
      success => {},
    );
    this.hideModal();
  }

  buildContent() {
    const card = this.state.cards[this.state.currentCardIndex];
    return (
      <>
        <Portal>
          <Modal
            style={this.styles.modal}
            visible={this.state.complaintModalVisible}
            dismissable={true}
            onDismiss={() => this.hideModal()}>
            <Card>
              <Card.Title title={'Beschwerde'} />
              <Card.Content>
                <Text>Welche Beschwerde hast du?</Text>
                <TextInput
                  left={
                    <TextInput.Icon
                      color={appColors.textIconColor}
                      name="alert-decagram"
                    />
                  }
                  label="Beschwerde"
                  value={this.state.complaintMessage}
                  onChangeText={text => {
                    this.setState({complaintMessage: text});
                  }}
                  style={this.styles.modalInput}
                />
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => this.hideModal()}>Abbrechen</Button>
                <Button onPress={() => this.sendComplaint()}>Ok</Button>
              </Card.Actions>
            </Card>
          </Modal>
        </Portal>
        <ScrollView>
          <Card style={this.styles.card}>
            <Card.Content>
              <Title>
                {this.state.isShowingQuestion ? card.question : card.answer}
              </Title>
            </Card.Content>
          </Card>
          {this.state.isShowingQuestion &&
            card.multipleChoiceItems &&
            card.multipleChoiceItems.length > 0 && (
              <View style={this.styles.subSection}>
                <Divider />
                <Caption style={this.styles.subSectionHint}>
                  MÖGLICHE ANTWORTEN
                </Caption>
                <DeckMultipleChoiceList
                  items={card.multipleChoiceItems}
                  isShowingAnswers={false}
                />
              </View>
            )}
          {!this.state.isShowingQuestion && card.picture && (
            <View style={this.styles.subSection}>
              <Divider />
              <Caption style={this.styles.subSectionHint}>BILD</Caption>
              <Image
                source={{
                  uri: card.picture,
                }}
                width={150}
                resizeMode="contain"
                style={this.styles.subSectionContent}
              />
            </View>
          )}
          {!this.state.isShowingQuestion && card.recording && (
            <View style={this.styles.subSection}>
              <Divider />
              <Caption style={this.styles.subSectionHint}>AUFNAHME</Caption>
              <AudioPlayer recording={card.recording} />
            </View>
          )}
          {!this.state.isShowingQuestion &&
            card.multipleChoiceItems &&
            card.multipleChoiceItems.length > 0 && (
              <View style={this.styles.subSection}>
                <Divider />
                <Caption style={this.styles.subSectionHint}>ANTWORTEN</Caption>
                <DeckMultipleChoiceList
                  items={card.multipleChoiceItems}
                  isShowingAnswers={true}
                />
              </View>
            )}
          {!this.state.isShowingQuestion && card.list && card.list.length > 0 && (
            <View style={this.styles.subSection}>
              <Divider />
              <Caption style={this.styles.subSectionHint}>LISTE</Caption>
              <DeckAnswerList items={card.list} />
            </View>
          )}
        </ScrollView>
        <Card>
          <Card.Content>
            <View style={this.styles.actionContainer}>
              <FAB
                style={this.styles.correct}
                color={'#ffffff'}
                small
                icon="check"
                onPress={() => {
                  this.onCorrectAnswer();
                }}
              />
              <FAB
                style={this.styles.wrong}
                small
                icon="close"
                onPress={() => {
                  this.onWrongAnswer();
                }}
              />
              <FAB
                style={this.styles.turn}
                small
                icon="refresh"
                onPress={() => {
                  this.setState({
                    isShowingQuestion: !this.state.isShowingQuestion,
                  });
                }}
              />
            </View>
            <View style={this.styles.positionIndicatorContainer}>
              <Caption>
                {this.state.currentCardIndex + 1}/{this.state.cards.length}{' '}
                Karten
              </Caption>
            </View>
          </Card.Content>
        </Card>
      </>
    );
  }

  getRandom(arr, count) {
    if (arr.length < count) {
      count = arr.length;
    }
    let result = new Array(count),
      len = arr.length,
      taken = new Array(len);
    while (count--) {
      let x = Math.floor(Math.random() * len);
      result[count] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }
}
