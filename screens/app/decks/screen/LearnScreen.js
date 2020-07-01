import {BaseDeckScreen} from '../base/BaseDeckScreen';
import {Appbar, Caption, Card, Divider, FAB, Title} from 'react-native-paper';
import {authStyles} from '../../../auth/AuthStyles';
import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import DeckMultipleChoiceList from '../component/DeckMultipleChoiceList';
import AudioPlayer from '../component/AudioPlayer';
import DeckAnswerList from '../component/DeckAnswerList';
import Image from 'react-native-scalable-image';
import {DeckCrudHelper} from '../../../../db/DeckCrudHelper';

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
  });
  box: number;
  count: number;
  updatedBoxStates = {};

  buildCustomState(): {} {
    return {
      cards: [],
      currentCardIndex: 0,
      isShowingQuestion: true,
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
      </Appbar.Header>
    );
  }

  buildContent() {
    const card = this.state.cards[this.state.currentCardIndex];
    return (
      <>
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
