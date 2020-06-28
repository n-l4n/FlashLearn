import {SafeAreaView, StatusBar, View} from 'react-native';
import {authStyles} from '../../../auth/AuthStyles';
import {ActivityIndicator, Appbar} from 'react-native-paper';
import {appColors} from '../../../../theme';
import React from 'react';
import {useDeckBaseState} from '../../../../BaseState';
import {useLoadDeck} from '../../../../db/DeckLoadHelper';

function LoadingPlaceholder() {
  return (
    <View style={authStyles.contentContainer}>
      <ActivityIndicator color={appColors.accent} />
    </View>
  );
}

function LoadingAppbarPlaceholder() {
  return (
    <Appbar.Header style={authStyles.appBar}>
      <Appbar.Content title="Deck laden..." />
    </Appbar.Header>
  );
}

export function BaseDeckScreen(
  route,
  navigation,
  contentCreator,
  appBarCreator,
) {
  const {deckId} = route.params;

  const baseState = useDeckBaseState();
  useLoadDeck(deckId, baseState);

  const content =
    baseState.deck != null ? contentCreator(baseState) : LoadingPlaceholder();
  const appBar =
    baseState.deck != null
      ? appBarCreator(baseState)
      : LoadingAppbarPlaceholder();

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
