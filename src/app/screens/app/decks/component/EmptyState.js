import React from 'react';
import {StyleSheet, View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {ThemeSwitcher} from '../../../../../../index';

export default class EmptyState extends React.Component {
  styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    text: {
      marginHorizontal: 16,
      textAlign: 'center',
    },
  });

  render() {
    return (
      <View style={this.styles.container}>
        <IconButton
          icon={this.props.icon}
          size={128}
          color={ThemeSwitcher.theme.colors.placeholder}
        />
        <Text
          style={[
            this.styles.text,
            {color: ThemeSwitcher.theme.colors.placeholder},
          ]}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}
