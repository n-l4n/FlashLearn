import BaseStatefulScreen from './BaseStatefulScreen';
import {ActivityIndicator, Appbar} from 'react-native-paper';
import {authStyles} from '../../../auth/AuthStyles';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {appColors} from '../../../../theme';
import React from 'react';

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
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={authStyles.contentNoCenter}>
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
