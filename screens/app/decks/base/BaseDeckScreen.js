import {SafeAreaView, StatusBar, View} from 'react-native';
import {authStyles} from '../../../auth/AuthStyles';
import {ActivityIndicator, Appbar} from 'react-native-paper';
import {appColors} from '../../../../theme';
import React from 'react';
import {useDeckBaseState} from '../../../../BaseState';
import {useLoadDeck} from '../../../../db/DeckLoadHelper';
import {DeckQueryHelper} from '../../../../db/DeckQueryHelper';
import {Deck} from '../../../../db/Deck';
import BaseStatefulScreen from './BaseStatefulScreen';
export class BaseDeckScreen extends BaseStatefulScreen {
  constructor(props) {
    super(props);
    this.state = this.buildBaseState();
  }

  buildBaseState() {
    return {
      ...super.buildBaseState(),
      ...this.buildCustomState(),
      deck: null,
    };
  }

  componentDidMount(): void {
    const deckId = this.getNavigationParam('deckId');
    if (deckId === null) {
      return;
    }
    if (deckId === 'new') {
      const deck = new Deck();
      this.onDeckLoaded(deck);
      this.setState({deck: deck});
      return;
    }
    DeckQueryHelper.findDeckById(
      deckId,
      deck => {
        if (!deck) {
          return;
        }
        this.onDeckLoaded(deck);
        this.setState({
          deck: deck,
        });
      },
      error => {
        console.log(error);
      },
    );
  }

  render() {
    const content =
      this.state.deck != null
        ? this.buildContent()
        : this.buildLoadingContent();
    const appBar =
      this.state.deck != null ? this.buildAppbar() : this.buildLoadingAppbar();

    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={authStyles.contentNoCenter}>
          {appBar}
          {content}
        </SafeAreaView>
      </>
    );
  }

  buildCustomState() {
    return {};
  }

  onDeckLoaded(deck) {}

  buildAppbar() {}

  buildContent() {}

  buildLoadingAppbar() {
    return (
      <Appbar.Header style={authStyles.appBar}>
        <Appbar.Content title="Deck laden..." />
      </Appbar.Header>
    );
  }

  buildLoadingContent() {
    return (
      <View style={authStyles.contentContainer}>
        <ActivityIndicator color={appColors.accent} />
      </View>
    );
  }

  getNavigationParam(id: string) {
    return this.route.params[id];
  }
}
