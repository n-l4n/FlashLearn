import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {HomeScreen} from '../screen/HomeScreen';
import {appColors} from '../../../../theme';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NewDeckScreen} from '../screen/NewDeckScreen';
import {DeckScreen} from '../screen/DeckScreen';
import {DeckShareScreen} from '../screen/DeckShareScreen';
import {NewDeckCardScreen} from '../screen/NewDeckCardScreen';

export function HomeNavigationContainer() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Home" headerMode="none">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NewDeck" component={NewDeckScreen} />
      <Stack.Screen name="Deck" component={DeckScreen} />
      <Stack.Screen name="ShareDeck" component={DeckShareScreen} />
      <Stack.Screen name="NewDeckCard" component={NewDeckCardScreen} />
    </Stack.Navigator>
  );
}
