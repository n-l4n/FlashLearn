import {BaseDeckScreen} from '../base/BaseDeckScreen';
import {Appbar, Text} from 'react-native-paper';
import {authStyles} from '../../../auth/AuthStyles';
import React from 'react';
import DeckCardList from '../component/DeckCardList';

export class DeckCardsScreen extends BaseDeckScreen {
  buildCustomState() {
    return {
      box: -1,
      cards: [],
    };
  }

  onDeckLoaded(deck) {
    this.state.box = this.getNavigationParam('box');
    console.log(this.state.box);
    if (this.state.box === -1) {
      this.state.cards = deck.cards;
    } else {
      this.state.cards = deck.cards.filter(card => card.box === this.state.box);
    }
  }

  buildAppbar() {
    return (
      <Appbar.Header style={authStyles.appBar}>
        <Appbar.BackAction onPress={() => this.navigation.goBack()} />
        <Appbar.Content
          title={
            this.state.box !== -1
              ? 'Box ' + (this.state.box + 1)
              : 'Alle Karten'
          }
        />
        <Appbar.Action icon="play-circle" onPress={() => {}} />
      </Appbar.Header>
    );
  }

  buildContent() {
    return (
      <>
        <DeckCardList
          cards={this.state.cards}
          onCardPress={card => {
            this.navigation.navigate('NewDeckCard', {
              deckId: this.state.deck.id,
              cardId: card.id,
            });
          }}
        />
      </>
    );
  }
}
