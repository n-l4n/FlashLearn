import {
  Appbar,
  Caption,
  FAB,
  TextInput,
  IconButton,
  Divider,
} from 'react-native-paper';
import {globalStyles} from '../../GlobalStyles';
import React, {useState} from 'react';
import {BaseDeckScreen} from './BaseDeckScreen';
import {authStyles} from '../auth/AuthStyles';
import {Dimensions, StyleSheet, View} from 'react-native';
import {appColors} from '../../theme';
import {DeckCrudHelper} from '../../db/DeckCrudHelper';
import DeckShareList from './DeckShareList';

const styles = StyleSheet.create({
  hintText: {
    width: '100%',
    alignSelf: 'flex-start',
    marginHorizontal: 16,
    marginTop: 8,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginTop: 8,
    marginStart: 16,
  },
  divider: {
    marginTop: 16,
    marginBottom: 8,
  },
});

function shareDeck(baseState, userMail) {
  DeckCrudHelper.useShareDeck(baseState.deck, userMail, success => {
    if (!success) {
      return;
    }
    baseState.deck.shares.push(userMail);
  });
}

function unshareDeck(baseState, userMail) {
  DeckCrudHelper.useUnshareDeck(baseState.deck, userMail, success => {
    if (!success) {
      return;
    }
    let index = baseState.deck.shares.indexOf(userMail);
    baseState.deck.shares.splice(index, 1);
  });
}

function DeckShareScreenImpl(baseState, navigation, userMail, setUserMail) {
  return (
    <>
      <Caption style={styles.hintText}>TEILEN MIT</Caption>
      <View style={styles.textInputContainer}>
        <TextInput
          left={<TextInput.Icon color={appColors.textIconColor} name="email" />}
          label="Email"
          value={userMail}
          onChangeText={text => setUserMail(text)}
          style={styles.textInput}
        />
        <IconButton
          icon="send"
          color={appColors.accent}
          size={28}
          onPress={() => {
            shareDeck(baseState, userMail);
          }}
        />
      </View>
      <Divider style={styles.divider} />
      <Caption style={styles.hintText}>GETEILT MIT</Caption>
      <DeckShareList
        shares={baseState.deck.shares}
        onDelete={share => {
          unshareDeck(baseState, share);
        }}
      />
    </>
  );
}

function DeckShareScreenAppbarImpl(baseState, navigation) {
  return (
    <Appbar.Header style={authStyles.appBar}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title={baseState.deck.name + ' teilen'} />
    </Appbar.Header>
  );
}

export function DeckShareScreen({route, navigation}) {
  const [userMail, setUserMail] = useState('');

  return BaseDeckScreen(
    route,
    navigation,
    baseState => {
      return DeckShareScreenImpl(baseState, navigation, userMail, setUserMail);
    },
    baseState => {
      return DeckShareScreenAppbarImpl(baseState, navigation);
    },
  );
}
