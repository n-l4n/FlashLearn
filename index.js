/**
 * @format
 */

import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import * as React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as TrackPlayer from 'react-native-track-player';
import AudioPlayerService from './screens/app/decks/component/AudioPlayerService';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#64B5F6',
    accent: '#CE93D8',
  },
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
TrackPlayer.registerPlaybackService(() => AudioPlayerService);
