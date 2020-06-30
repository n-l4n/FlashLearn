import {SafeAreaView, StatusBar} from 'react-native';
import {authStyles} from '../../../auth/AuthStyles';
import {Appbar, FAB} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../../../../GlobalStyles';
import auth from '@react-native-firebase/auth';
import {DeckQueryHelper} from '../../../../db/DeckQueryHelper';
import DeckList from '../component/DeckList';

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
          onDeckPress={deck =>
            navigation.navigate('Deck', {
              deckId: deck.id,
            })
          }
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
