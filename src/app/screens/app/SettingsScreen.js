import {SafeAreaView, StyleSheet} from 'react-native';
import {authStyles} from '../auth/AuthStyles';
import {Appbar, Checkbox, List} from 'react-native-paper';
import React from 'react';
import ThemedStatusBar from './component/ThemedStatusBar';
import {ThemeSwitcher} from '../../../../index';
import BaseStatefulScreen from './decks/base/BaseStatefulScreen';
import Pref from '../../../PreferenceHelper';
import RNRestart from 'react-native-restart';

export class SettingsScreen extends BaseStatefulScreen {
  styles = StyleSheet.create({
    listItem: {
      alignItems: 'center',
      marginLeft: 8,
      marginRight: 12,
    },
  });
  constructor(props) {
    super(props);
    this.state = this.buildBaseState();
    Pref.get('theme', 'light').then(val => {
      this.setState({isDarkMode: val === 'dark'});
    });
  }

  async buildBaseState() {
    return {
      ...super.buildBaseState(),
      isDarkMode: false,
    };
  }

  render() {
    return (
      <>
        <ThemedStatusBar barStyle="dark-content" />
        <SafeAreaView
          style={[
            authStyles.content,
            {backgroundColor: ThemeSwitcher.theme.colors.backdrop},
          ]}>
          <Appbar.Header style={authStyles.appBar}>
            <Appbar.Content title="Einstellungen" />
          </Appbar.Header>
          <List.Item
            title="Dark Mode"
            description="Legt fest ob die Applikation in einem dunklen Modus angezeigt werden soll."
            style={this.styles.listItem}
            right={props => {
              return (
                <Checkbox
                  {...props}
                  status={this.state.isDarkMode ? 'checked' : 'unchecked'}
                  onPress={async () => {
                    this.state.isDarkMode = !this.state.isDarkMode;
                    await Pref.set(
                      'theme',
                      this.state.isDarkMode ? 'dark' : 'light',
                    );
                    RNRestart.Restart();
                  }}
                />
              );
            }}
          />
        </SafeAreaView>
      </>
    );
  }
}
