import {authStyles} from '../../../auth/AuthStyles';
import {Appbar, Button, FAB} from 'react-native-paper';
import {globalStyles} from '../../../../GlobalStyles';
import React from 'react';
import {BaseDeckScreen} from '../base/BaseDeckScreen';
import BoxList from '../component/BoxList';
import {appColors} from '../../../../theme';
import {View, StyleSheet} from 'react-native';
import {AuthHelper} from '../../../../db/AuthHelper';

export class DeckScreen extends BaseDeckScreen {
  buildAppbar() {
    return (
      <Appbar.Header style={authStyles.appBar}>
        <Appbar.BackAction onPress={() => this.navigation.goBack()} />
        <Appbar.Content title={this.state.deck.name} />
        {this.state.deck.ownerId === AuthHelper.userId() && (
          <Appbar.Action
            icon="share"
            onPress={() => {
              this.navigation.navigate('ShareDeck', {
                deckId: this.state.deck.id,
              });
            }}
          />
        )}
        <Appbar.Action
          icon="play-circle"
          onPress={() => {
            this.navigation.navigate('Learn', {
              deckId: this.state.deck.id,
              box: -1,
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
        <BoxList
          deck={this.state.deck}
          onBoxPress={box => {
            this.navigation.navigate('Box', {
              deckId: this.state.deck.id,
              box: box,
            });
          }}
        />
        <Button
          mode="text"
          color={appColors.accent}
          onPress={() => {
            this.navigation.navigate('Box', {
              deckId: this.state.deck.id,
              box: -1,
            });
          }}>
          Alle Karten anzeigen
        </Button>
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
