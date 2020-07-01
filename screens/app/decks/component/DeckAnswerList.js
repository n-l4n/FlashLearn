import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {IconButton, List, TextInput} from 'react-native-paper';
import {appColors} from '../../../../theme';

const styles = StyleSheet.create({
  listItem: {
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 12,
  },
  textInputContainer: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
  },
});

export default class DeckAnswerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.buildItemsFromProps(),
      text: '',
    };
  }

  buildItemsFromProps() {
    const items = this.props.items.slice();
    if (this.props.isEditing) {
      items.push('edit-item');
    }
    return items;
  }

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ): void {
    if (prevProps.items.length !== this.props.items.length) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        items: this.buildItemsFromProps(),
      });
    }
  }

  render() {
    return this.state.items.map(item => {
      if (item !== 'edit-item') {
        return (
          <List.Item
            key={item}
            title={item}
            style={styles.listItem}
            right={props => {
              return this.props.isEditing ? (
                <IconButton
                  {...props}
                  icon="delete"
                  color={appColors.textIconColor}
                  size={24}
                  onPress={() => this.props.onDelete(item)}
                />
              ) : null;
            }}
          />
        );
      } else {
        return (
          <View style={styles.textInputContainer} key={'edit-text'}>
            <TextInput
              value={this.state.text}
              onChangeText={text => {
                this.setState({
                  text: text,
                });
              }}
              style={styles.textInput}
              label="Neue Antwort"
            />
            <IconButton
              icon="plus"
              color={appColors.textIconColor}
              size={24}
              onPress={() => {
                this.props.onNewItem(this.state.text);
                this.setState({
                  text: '',
                });
              }}
            />
          </View>
        );
      }
    });
  }
}
