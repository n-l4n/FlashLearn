import {authStyles} from '../../../auth/AuthStyles';
import {Appbar, FAB} from 'react-native-paper';
import {globalStyles} from '../../../../GlobalStyles';
import React from 'react';
import {BaseDeckScreen} from '../base/BaseDeckScreen';

function DeckScreenImpl(baseState, navigation) {
  return (
    <>
      <FAB
        style={globalStyles.fab}
        icon="plus"
        onPress={() => {
          navigation.navigate('NewDeckCard', {
            deckId: baseState.deck.id,
            cardId: 'new',
          });
        }}
      />
    </>
  );
}

function DeckScreenAppbarImpl(baseState, navigation) {
  return (
    <Appbar.Header style={authStyles.appBar}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title={baseState.deck.name} />
      <Appbar.Action
        icon="share"
        onPress={() => {
          navigation.navigate('ShareDeck', {
            deckId: baseState.deck.id,
          });
        }}
      />
    </Appbar.Header>
  );
}

export function DeckScreen({route, navigation}) {
  return BaseDeckScreen(
    route,
    navigation,
    baseState => {
      return DeckScreenImpl(baseState, navigation);
    },
    baseState => {
      return DeckScreenAppbarImpl(baseState, navigation);
    },
  );
}
