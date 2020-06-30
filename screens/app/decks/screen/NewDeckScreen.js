import {View} from 'react-native';
import {authStyles} from '../../../auth/AuthStyles';
import {Appbar, FAB, Snackbar, TextInput} from 'react-native-paper';
import {globalStyles} from '../../../../GlobalStyles';
import React from 'react';
import {appColors} from '../../../../theme';
import {DeckCrudHelper} from '../../../../db/DeckCrudHelper';
import {AuthHelper} from '../../../../db/AuthHelper';
import {BaseDeckScreen} from '../base/BaseDeckScreen';

export class NewDeckScreen extends BaseDeckScreen {
  buildCustomState(): {} {
    return {
      name: '',
    };
  }

  onDeckLoaded(deck) {
    this.state.name = deck.name;
  }

  buildAppbar() {
    return (
      <Appbar.Header style={authStyles.appBar}>
        <Appbar.BackAction onPress={() => this.navigation.goBack()} />
        <Appbar.Content title="Neues Deck" />
        {this.getNavigationParam('deckId') !== 'new' && (
          <Appbar.Action icon={'delete'} onPress={() => this.deleteDeck()} />
        )}
      </Appbar.Header>
    );
  }

  buildContent() {
    return (
      <>
        <View style={authStyles.contentContainer}>
          <TextInput
            left={
              <TextInput.Icon color={appColors.textIconColor} name="folder" />
            }
            label="Name"
            value={this.state.name}
            onChangeText={text => {
              this.setState({name: text});
            }}
            style={authStyles.text}
          />
        </View>
        <Snackbar
          visible={this.getError()}
          onDismiss={() => this.setError(null)}>
          Beim Ausführen dieser Aktion ist etwas schief gelaufen.
        </Snackbar>
        <FAB
          style={globalStyles.fab}
          icon="check"
          loading={this.isLoading()}
          disabled={this.isLoading()}
          onPress={() => {
            this.setIsLoading(true);
            this.state.deck.name = this.state.name;
            if (this.getNavigationParam('deckId') === 'new') {
              this.createDeck();
            } else {
              this.updateDeck();
            }
          }}
        />
      </>
    );
  }

  createDeck() {
    this.state.deck.ownerId = AuthHelper.userId();
    DeckCrudHelper.createDeck(this.state.deck, success =>
      this.onDeckChangeResult(success),
    );
  }

  updateDeck() {
    DeckCrudHelper.updateDeck(this.state.deck, success =>
      this.onDeckChangeResult(success),
    );
  }
    deleteDeck() {
        DeckCrudHelper.deleteDeck(this.state.deck, success =>
            this.onDeckChangeResult(success),
        );
    }


  onDeckChangeResult(success: boolean) {
    this.setIsLoading(false);
    if (success) {
      this.navigation.goBack();
    } else {
      this.setError('firebase_err');
    }
  }
}
