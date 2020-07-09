import {SafeAreaView, View} from 'react-native';
import {authStyles} from './AuthStyles';
import {FAB, Headline, ProgressBar} from 'react-native-paper';
import React from 'react';
import {globalStyles} from '../../../GlobalStyles';
import ThemedStatusBar from '../app/component/ThemedStatusBar';
import {ThemeSwitcher} from '../../../../index';

export function LoadingScreen() {
  return (
    <>
      <ThemedStatusBar />
      <SafeAreaView
        style={[
          authStyles.content,
          {backgroundColor: ThemeSwitcher.theme.colors.backdrop},
        ]}>
        <Headline style={authStyles.logo}>FlashLearn</Headline>
        <View style={authStyles.contentContainer}>
          <ProgressBar indeterminate="true" />
        </View>
        <FAB style={globalStyles.fab} icon="login" />
      </SafeAreaView>
    </>
  );
}
