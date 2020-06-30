import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Checkbox, IconButton, List, TextInput} from 'react-native-paper';
import {appColors} from '../../../../theme';
import {MultipleChoiceItem} from '../../../../db/DeckCard';

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

export default class DeckMultipleChoiceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.buildItemsFromProps(),
      text: '',
      isCorrect: false,
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
            key={item.text}
            title={item.text}
            description={
              item.isCorrect ? 'Korrekte Antwort' : 'Falsche Antwort'
            }
            style={styles.listItem}
            right={props => {
              return (
                <IconButton
                  {...props}
                  icon="delete"
                  color={appColors.textIconColor}
                  size={24}
                  onPress={() => this.props.onDelete(item)}
                />
              );
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
            <Checkbox
              status={this.state.isCorrect ? 'checked' : 'unchecked'}
              onPress={() => {
                this.setState({
                  isCorrect: !this.state.isCorrect,
                });
              }}
            />
            <IconButton
              icon="plus"
              color={appColors.textIconColor}
              size={24}
              onPress={() => {
                const publishItem = new MultipleChoiceItem();
                publishItem.text = this.state.text;
                publishItem.isCorrect = this.state.isCorrect;
                this.props.onNewItem(publishItem);
                this.setState({
                  text: '',
                  isCorrect: false,
                });
              }}
            />
          </View>
        );
      }
    });
  }
}
