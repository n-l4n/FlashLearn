import {authStyles} from '../../../auth/AuthStyles';
import {Appbar, FAB} from 'react-native-paper';
import {globalStyles} from '../../../../GlobalStyles';
import React from 'react';
import {BaseDeckScreen} from '../base/BaseDeckScreen';

export class DeckScreen extends BaseDeckScreen {
  buildAppbar() {
    return (
      <Appbar.Header style={authStyles.appBar}>
        <Appbar.BackAction onPress={() => this.navigation.goBack()} />
        <Appbar.Content title={this.state.deck.name} />
        <Appbar.Action
          icon="share"
          onPress={() => {
            this.navigation.navigate('ShareDeck', {
              deckId: this.state.deck.id,
            });
          }}
        />
      </Appbar.Header>
    );
  }

  buildContent() {
    return (
      <>
        <FAB
          style={globalStyles.fab}
          icon="plus"
          onPress={() => {
            this.navigation.navigate('NewDeckCard', {
              deckId: this.state.deck.id,
              cardId: 'new',
            });
          }}
        />
      </>
    );
  }
}
