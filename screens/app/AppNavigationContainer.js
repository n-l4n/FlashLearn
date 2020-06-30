import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {HomeScreen} from './decks/screen/HomeScreen';
import {appColors} from '../../theme';
import {HomeNavigationContainer} from './decks/nav/HomeNavigationContainer';
import {NotificationScreen} from './NotificationScreen';
import {SettingsScreen} from './SettingsScreen';

export function AppNavigationContainer() {
  const Tab = createMaterialBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Decks"
        headerMode="none"
        shifting={true}
        sceneAnimationEnabled={false}>
        <Tab.Screen
          name="Decks"
          component={HomeNavigationContainer}
          options={{
            tabBarIcon: 'folder-multiple',
            tabBarColor: appColors.primary,
            activeColor: '#000000',
            inactiveColor: 'rgba(0, 0, 0, .6)',
          }}
        />
        <Tab.Screen
          name="Nachrichten"
          component={NotificationScreen}
          options={{
            tabBarIcon: 'bell',
            tabBarColor: appColors.primary,
            activeColor: '#000000',
            inactiveColor: 'rgba(0, 0, 0, .6)',
          }}
        />
        <Tab.Screen
          name="Einstellungen"
          component={SettingsScreen}
          options={{
            tabBarIcon: 'settings',
            tabBarColor: appColors.primary,
            activeColor: '#000000',
            inactiveColor: 'rgba(0, 0, 0, .6)',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
