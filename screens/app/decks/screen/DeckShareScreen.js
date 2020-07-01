import {Appbar, Caption, Divider, IconButton, TextInput} from 'react-native-paper';
import React from 'react';
import {BaseDeckScreen} from '../base/BaseDeckScreen';
import {authStyles} from '../../../auth/AuthStyles';
import {StyleSheet, View} from 'react-native';
import {appColors} from '../../../../theme';
import {DeckCrudHelper} from '../../../../db/DeckCrudHelper';
import DeckShareList from '../component/DeckShareList';

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

export class DeckShareScreen extends BaseDeckScreen {
  buildCustomState(): {} {
    return {
      userMail: '',
    };
  }

  buildAppbar() {
    return (
      <Appbar.Header style={authStyles.appBar}>
        <Appbar.BackAction onPress={() => this.navigation.goBack()} />
        <Appbar.Content title={this.state.deck.name + ' teilen'} />
      </Appbar.Header>
    );
  }

  buildContent() {
    return (
      <>
        <Caption style={styles.hintText}>TEILEN MIT</Caption>
        <View style={styles.textInputContainer}>
          <TextInput
            left={
              <TextInput.Icon color={appColors.textIconColor} name="email" />
            }
            label="Email"
            value={this.state.userMail}
            onChangeText={text =>
              this.setState({
                userMail: text,
              })
            }
            style={styles.textInput}
          />
          <IconButton
            icon="send"
            color={appColors.accent}
            size={28}
            onPress={() => {
              this.shareDeck();
            }}
          />
        </View>
        <Divider style={styles.divider} />
        <Caption style={styles.hintText}>GETEILT MIT</Caption>
        <DeckShareList
          shares={this.state.deck.shares}
          onDelete={share => {
            this.unshareDeck(share);
          }}
        />
      </>
    );
  }

  shareDeck() {
    DeckCrudHelper.shareDeck(this.state.deck, this.state.userMail, success => {
      if (!success) {
        return;
      }
      this.setState({
        userMail: '',
      });
    });
  }

  unshareDeck(userMail) {
    DeckCrudHelper.unshareDeck(this.state.deck, userMail, success => {
      if (!success) {
        return;
      }
      this.setState();
    });
  }
}
