import {SafeAreaView, StatusBar} from 'react-native';
import {authStyles} from '../auth/AuthStyles';
import {Appbar} from 'react-native-paper';
import React from 'react';
import auth from '@react-native-firebase/auth';

function logout() {
  auth().signOut();
}

export function SettingsScreen({navigation}) {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={authStyles.content}>
        <Appbar.Header style={authStyles.appBar}>
          <Appbar.Content title="Einstellungen" />
        </Appbar.Header>
      </SafeAreaView>
    </>
  );
}
