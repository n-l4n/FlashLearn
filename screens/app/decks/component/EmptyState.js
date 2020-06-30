import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon} from 'react-native-vector-icons/dist';
import {Text, IconButton} from 'react-native-paper';

export default class EmptyState extends React.Component {
  styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    text: {
      color: 'rgba(0, 0, 0, .6)',
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
          color={'rgba(0, 0, 0, .6)'}
        />
        <Text style={this.styles.text}>{this.props.text}</Text>
      </View>
    );
  }
}
