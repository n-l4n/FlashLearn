import {SafeAreaView, StatusBar, View} from 'react-native';
import {authStyles} from '../auth/AuthStyles';
import {Appbar, Button, FAB, Headline, TextInput} from 'react-native-paper';
import {appColors} from '../../theme';
import React, {useState, useEffect} from 'react';
import {globalStyles} from '../../GlobalStyles';
import auth from '@react-native-firebase/auth';
import {DeckQueryHelper} from '../../db/DeckQueryHelper';
import DeckList from './DeckList';

function logout() {
  auth().signOut();
}

function loadDecks(setDecks) {
  DeckQueryHelper.findDecks(
    decks => {
      setDecks(decks);
    },
    error => {},
  );
}

export function HomeScreen({navigation}) {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    loadDecks(setDecks);
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={authStyles.content}>
        <Appbar.Header style={authStyles.appBar}>
          <Appbar.Content title="Home" />
          <Appbar.Action icon="logout" onPress={() => logout()} />
        </Appbar.Header>
        <DeckList
          decks={decks}
          onEdit={deck =>
            navigation.navigate('NewDeck', {
              deckId: deck.id,
            })
          }
        />
        <FAB
          style={globalStyles.fab}
          icon="plus"
          onPress={() =>
            navigation.navigate('NewDeck', {
              deckId: 'new',
            })
          }
        />
      </SafeAreaView>
    </>
  );
}
