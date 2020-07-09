import BaseStatefulScreen from './BaseStatefulScreen';
import {ActivityIndicator, Appbar} from 'react-native-paper';
import {authStyles} from '../../../auth/AuthStyles';
import {SafeAreaView, View} from 'react-native';
import {appColors, themedBackgroundColor} from '../../../../../theme';
import React from 'react';
import {ThemeSwitcher} from '../../../../../../index';
import ThemedStatusBar from '../../component/ThemedStatusBar';

export default class BaseContentLoadScreen extends BaseStatefulScreen {
  render() {
    const content = this.isContentReady()
      ? this.buildContent()
      : this.buildLoadingContent();
    const appBar = this.isContentReady()
      ? this.buildAppbar()
      : this.buildLoadingAppbar();

    return (
      <>
        <ThemedStatusBar />
        <SafeAreaView
          style={[authStyles.contentNoCenter, themedBackgroundColor()]}>
          {appBar}
          {content}
        </SafeAreaView>
      </>
    );
  }

  buildBaseState() {
    return {
      ...super.buildBaseState(),
      isContentReady: false,
    };
  }

  buildAppbar() {}

  buildContent() {}

  buildLoadingAppbar() {
    return (
      <Appbar.Header style={authStyles.appBar}>
        <Appbar.Content title={this.getLoadingText()} />
      </Appbar.Header>
    );
  }

  buildLoadingContent() {
    return (
      <View style={authStyles.contentContainer}>
        <ActivityIndicator color={appColors.accent} />
      </View>
    );
  }

  isContentReady(): boolean {
    return this.state.isContentReady;
  }

  setIsContentReady(isContentReady: boolean) {
    this.setState({isContentReady: isContentReady});
  }

  getLoadingText() {
    return 'Lade...';
  }
}
