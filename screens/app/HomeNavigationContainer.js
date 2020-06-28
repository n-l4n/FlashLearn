import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {HomeScreen} from './HomeScreen';
import {appColors} from '../../theme';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NewDeckScreen} from './NewDeckScreen';
import {DeckScreen} from './DeckScreen';
import {DeckShareScreen} from './DeckShareScreen';

export function HomeNavigationContainer() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Home" headerMode="none">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NewDeck" component={NewDeckScreen} />
      <Stack.Screen name="Deck" component={DeckScreen} />
      <Stack.Screen name="ShareDeck" component={DeckShareScreen} />
    </Stack.Navigator>
  );
}
