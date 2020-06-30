import {SafeAreaView, StatusBar} from 'react-native';
import {authStyles} from '../../../auth/AuthStyles';
import {Appbar, FAB} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../../../../GlobalStyles';
import auth from '@react-native-firebase/auth';
import {DeckQueryHelper} from '../../../../db/DeckQueryHelper';
import DeckList from '../component/DeckList';
import BaseStatefulScreen from '../base/BaseStatefulScreen';
import BaseContentLoadScreen from '../base/BaseContentLoadScreen';

export class HomeScreen extends BaseContentLoadScreen {
  constructor(props) {
    super(props);
    this.state = this.buildBaseState();
  }

  componentDidMount(): void {
    this.loadDecks();
  }

  buildBaseState() {
    return {
      ...super.buildBaseState(),
      decks: [],
    };
  }

  buildAppbar() {
    return (
      <Appbar.Header style={authStyles.appBar}>
        <Appbar.Content title="Home" />
        <Appbar.Action icon="logout" onPress={() => this.logout()} />
      </Appbar.Header>
    );
  }

  buildContent() {
    return (
      <>
        <DeckList
          decks={this.state.decks}
          onDeckPress={deck =>
            this.navigation.navigate('Deck', {
              deckId: deck.id,
            })
          }
          onEdit={deck =>
            this.navigation.navigate('NewDeck', {
              deckId: deck.id,
            })
          }
        />
        <FAB
          style={globalStyles.fab}
          icon="plus"
          onPress={() =>
            this.navigation.navigate('NewDeck', {
              deckId: 'new',
            })
          }
        />
      </>
    );
  }

  loadDecks() {
    DeckQueryHelper.findDecks(
      decks => {
        this.state.decks = decks;
        this.setIsContentReady(true);
      },
      error => {
        this.setError('firebase-err');
        this.setIsContentReady(true);
      },
    );
  }

  logout() {
    auth().signOut();
  }

  getLoadingText(): string {
    return 'Decks laden...';
  }
}
