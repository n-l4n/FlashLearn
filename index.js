/**
 * @format
 */

import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import React, {useState} from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as TrackPlayer from 'react-native-track-player';
import AudioPlayerService from './screens/app/decks/component/AudioPlayerService';
import {appColors} from './theme';
import Pref from './PreferenceHelper';

export class ThemeSwitcher {
  static light = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      primary: '#64B5F6',
      accent: '#CE93D8',
      background: '#e0e0e0',
      backdrop: '#eeeeee',
      surface: '#ffffff',
      text: '#000000',
      placeholder: 'rgba(0, 0, 0, .6)',
      disabled: 'rgba(0, 0, 0, .3)',
    },
  };
  static dark = {
    ...DefaultTheme,
    dark: true,
    colors: {
      ...DefaultTheme.colors,
      primary: '#111111',
      accent: '#9c27b0',
      background: '#212121',
      backdrop: '#000000',
      surface: '#212121',
      text: '#ffffff',
      placeholder: 'rgba(255, 255, 255, .6)',
      disabled: 'rgba(255, 255, 255, .3)',
    },
  };

  static theme = ThemeSwitcher.light;
  static setTheme: () => {};
}

export default function Main() {
  [ThemeSwitcher.theme, ThemeSwitcher.setTheme] = useState(ThemeSwitcher.light);
  Pref.get('theme', 'light').then(val => {
    if (val === 'dark') {
      ThemeSwitcher.setTheme(ThemeSwitcher.dark);
    }
  });

  appColors.primary = ThemeSwitcher.theme.colors.primary;
  appColors.accent = ThemeSwitcher.theme.colors.accent;
  appColors.textIconColor = ThemeSwitcher.theme.colors.placeholder;

  return (
    <PaperProvider theme={ThemeSwitcher.theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
TrackPlayer.registerPlaybackService(() => AudioPlayerService);
