import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NotificationScreen} from '../screen/NotificationScreen';
import {NewDeckCardScreen} from '../../decks/screen/NewDeckCardScreen';

export function NotificationNavigationContainer() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Notifications" headerMode="none">
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="NewDeckCard" component={NewDeckCardScreen} />
    </Stack.Navigator>
  );
}
