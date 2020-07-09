import {StatusBar} from 'react-native';
import {ThemeSwitcher} from '../../../../../index';
import React from 'react';

export default function ThemedStatusBar() {
  return (
    <StatusBar
      barStyle={ThemeSwitcher.theme.dark ? 'light-content' : 'dark-content'}
      backgroundColor={ThemeSwitcher.theme.colors.primary}
    />
  );
}
