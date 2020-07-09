import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {appColors} from '../../../../theme';
import {HomeNavigationContainer} from './decks/nav/HomeNavigationContainer';
import {SettingsScreen} from './SettingsScreen';
import {NotificationNavigationContainer} from './notifications/nav/NotificationNavigationContainer';
import {ThemeSwitcher} from '../../../../index';

export function AppNavigationContainer() {
  const Tab = createMaterialBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Decks"
        headerMode="none"
        shifting={true}
        sceneAnimationEnabled={false}
        activeColor={ThemeSwitcher.theme.colors.text}
        inactiveColor={ThemeSwitcher.theme.colors.placeholder}>
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
          component={NotificationNavigationContainer}
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
