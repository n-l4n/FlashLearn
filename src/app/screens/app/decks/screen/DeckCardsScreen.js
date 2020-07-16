import {BaseDeckScreen} from '../base/BaseDeckScreen';
import {Appbar} from 'react-native-paper';
import {authStyles} from '../../../auth/AuthStyles';
import React from 'react';
import DeckCardList from '../component/DeckCardList';
import EmptyState from '../component/EmptyState';

export class DeckCardsScreen extends BaseDeckScreen {
  buildCustomState() {
    return {
      box: -1,
      cards: [],
    };
  }

  onDeckLoaded(deck) {
    this.state.box = this.getNavigationParam('box');
    if (this.state.box === -1) {
      this.state.cards = deck.cards;
    } else {
      this.state.cards = deck.cards.filter(
        card => card.getCurrentBoxForUser() === this.state.box,
      );
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
        <Appbar.Action
          icon="play-circle"
          disabled={this.state.cards.length === 0}
          onPress={() => {
            this.navigation.navigate('Learn', {
              deckId: this.state.deck.id,
              box: this.state.box,
              count: 10,
            });
          }}
        />
      </Appbar.Header>
    );
  }

  buildContent() {
    return (
      <>
        {this.state.cards.length > 0 ? (
          <DeckCardList
            cards={this.state.cards}
            onCardPress={card => {
              this.navigation.navigate('NewDeckCard', {
                deckId: this.state.deck.id,
                cardId: card.id,
              });
            }}
          />
        ) : (
          <EmptyState text={'Alle Karten erledigt'} icon={'check-all'} />
        )}
      </>
    );
  }
}
