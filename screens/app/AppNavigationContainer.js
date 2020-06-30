import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
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
        sceneAnimationEnabled={false}
        activeColor="#000000"
        inactiveColor="rgba(0, 0, 0, .6)">
        <Tab.Screen
          name="Decks"
          component={HomeNavigationContainer}
          options={{
            tabBarIcon: 'folder-multiple',
            tabBarColor: appColors.primary,
          }}
        />
        <Tab.Screen
          name="Nachrichten"
          component={NotificationScreen}
          options={{
            tabBarIcon: 'bell',
            tabBarColor: appColors.primary,
          }}
        />
        <Tab.Screen
          name="Einstellungen"
          component={SettingsScreen}
          options={{
            tabBarIcon: 'settings',
            tabBarColor: appColors.primary,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
