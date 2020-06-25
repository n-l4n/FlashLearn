import {SafeAreaView, StatusBar, View} from 'react-native';
import {authStyles} from '../auth/AuthStyles';
import {Appbar, Button, FAB, Headline, TextInput} from 'react-native-paper';
import {appColors} from '../../theme';
import React from 'react';
import {globalStyles} from '../../GlobalStyles';
import auth from '@react-native-firebase/auth';

function logout() {
  auth().signOut();
}

export function HomeScreen({navigation}) {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={authStyles.content}>
        <Appbar.Header style={authStyles.appBar}>
          <Appbar.Content title="Home" />
          <Appbar.Action icon="logout" onPress={() => logout()} />
        </Appbar.Header>

        <FAB style={globalStyles.fab} icon="plus" />
      </SafeAreaView>
    </>
  );
}
