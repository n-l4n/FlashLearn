import {SafeAreaView} from 'react-native';
import {authStyles} from '../auth/AuthStyles';
import {Appbar, Checkbox, List} from 'react-native-paper';
import React from 'react';
import ThemedStatusBar from './component/ThemedStatusBar';
import {ThemeSwitcher} from '../../index';
import BaseStatefulScreen from './decks/base/BaseStatefulScreen';
import Pref from '../../PreferenceHelper';

export class SettingsScreen extends BaseStatefulScreen {
  constructor(props) {
    super(props);
    this.state = this.buildBaseState();
  }

  async buildBaseState() {
    return {
      ...super.buildBaseState(),
      isDarkMode: (await Pref.get('theme', 'light')) === 'dark',
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
            right={props => {
              return (
                <Checkbox
                  status={this.state.isDarkMode ? 'checked' : 'unchecked'}
                  onPress={async () => {
                    this.state.isDarkMode = !this.state.isDarkMode;
                    await Pref.set(
                      'theme',
                      this.state.isDarkMode ? 'dark' : 'light',
                    );
                    ThemeSwitcher.setTheme(
                      this.state.isDarkMode
                        ? ThemeSwitcher.dark
                        : ThemeSwitcher.light,
                    );
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
