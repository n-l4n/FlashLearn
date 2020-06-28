import {SafeAreaView, StatusBar, View} from 'react-native';
import {authStyles} from '../../../auth/AuthStyles';
import {ActivityIndicator, Appbar, FAB} from 'react-native-paper';
import {globalStyles} from '../../../../GlobalStyles';
import React, {useState, useEffect} from 'react';
import {useBaseState, useDeckBaseState} from '../../../../BaseState';
import {appColors} from '../../../../theme';
import {useLoadDeck} from '../../../../db/DeckLoadHelper';
import {BaseDeckScreen} from '../base/BaseDeckScreen';

function DeckScreenImpl(baseState, navigation) {
  return (
    <>
      <FAB style={globalStyles.fab} icon="plus" onPress={() => {}} />
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
