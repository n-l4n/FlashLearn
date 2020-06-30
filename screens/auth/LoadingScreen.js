import {SafeAreaView, StatusBar, View} from 'react-native';
import {authStyles} from './AuthStyles';
import {FAB, Headline, ProgressBar} from 'react-native-paper';
import React from 'react';
import {globalStyles} from '../../GlobalStyles';

export function LoadingScreen() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={authStyles.content}>
        <Headline style={authStyles.logo}>FlashLearn</Headline>
        <View style={authStyles.contentContainer}>
          <ProgressBar indeterminate="true" />
        </View>
        <FAB style={globalStyles.fab} icon="login" />
      </SafeAreaView>
    </>
  );
}
