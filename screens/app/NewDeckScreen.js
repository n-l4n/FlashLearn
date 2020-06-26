import {SafeAreaView, StatusBar, View} from 'react-native';
import {authStyles} from '../auth/AuthStyles';
import {Appbar, Button, FAB, Snackbar, TextInput} from 'react-native-paper';
import {globalStyles} from '../../GlobalStyles';
import React, {useState, useEffect} from 'react';
import {useBaseState} from '../../BaseState';
import {DeckQueryHelper} from '../../db/DeckQueryHelper';
import {Deck} from '../../db/Deck';
import {appColors} from '../../theme';
import {DeckCrudHelper} from '../../db/DeckCrudHelper';
import {AuthHelper} from '../../db/AuthHelper';

function createDeck(deck, baseState, navigation) {
  deck.ownerId = AuthHelper.userId();
  DeckCrudHelper.useCreateDeck(deck, success => {
    baseState.setLoading(false);
    if (success) {
      navigation.goBack();
    } else {
      baseState.setError('firebase_err');
    }
  });
}

function updateDeck(deck, baseState, navigation) {
  DeckCrudHelper.useUpdateDeck(deck, success => {
    baseState.setLoading(false);
    if (success) {
      navigation.goBack();
    } else {
      baseState.setError('firebase_err');
    }
  });
}

function loadDeck(deckId, setDeck, setName) {
  if (deckId !== 'new') {
    DeckQueryHelper.useDeckById(
      deckId,
      deck => {
        if (!deck) {
          return;
        }
        setDeck(deck);
        setName(deck.name);
      },
      error => {
        console.log(error);
      },
    );
  }
}

export function NewDeckScreen({route, navigation}) {
  const {deckId} = route.params;

  const baseState = useBaseState();
  const [deck, setDeck] = useState(new Deck());
  const [name, setName] = useState('');

  useEffect(() => {
    loadDeck(deckId, setDeck, setName);
  }, [deckId]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={authStyles.content}>
        <Appbar.Header style={authStyles.appBar}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Neues Deck" />
        </Appbar.Header>
        <View style={authStyles.contentContainer}>
          <TextInput
            left={
              <TextInput.Icon color={appColors.textIconColor} name="folder" />
            }
            label="Name"
            value={name}
            onChangeText={text => {
              setName(text);
            }}
            style={authStyles.text}
          />
        </View>
        <Snackbar
          visible={baseState.error}
          onDismiss={() => baseState.setError(null)}>
          Beim Ausführen dieser Aktion ist etwas schief gelaufen.
        </Snackbar>
        <FAB
          style={globalStyles.fab}
          icon="check"
          loading={baseState.loading}
          disabled={baseState.loading}
          onPress={() => {
            baseState.setLoading(true);
            deck.name = name;
            if (deckId === 'new') {
              createDeck(deck, baseState, navigation);
            } else {
              updateDeck(deck, baseState, navigation);
            }
          }}
        />
      </SafeAreaView>
    </>
  );
}
