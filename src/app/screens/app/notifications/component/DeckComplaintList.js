import React, {Component} from 'react';
import {Dimensions, FlatList, StyleSheet} from 'react-native';
import {IconButton, List} from 'react-native-paper';
import {appColors} from '../../../../../theme';

const styles = StyleSheet.create({
  cardListContainer: {
    width: '100%',
  },
  card: {
    width: Dimensions.get('window').width - 8,
    margin: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDescription: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardCount: {
    color: 'rgba(0, 0, 0, .6)',
  },
});

export default class DeckComplaintList extends Component {
  render() {
    return (
      <FlatList
        data={this.props.complaints}
        keyExtractor={item => item.deckId + item.cardId + item.message}
        renderItem={listItem => {
          return (
            <List.Item
              onPress={() => this.props.onOpen(listItem.item)}
              title={listItem.item.message}
              description={null}
              style={styles.listItem}
              right={props => {
                return (
                  <IconButton
                    {...props}
                    icon="check"
                    color={appColors.textIconColor}
                    size={24}
                    onPress={() => this.props.onDone(listItem.item)}
                  />
                );
              }}
            />
          );
        }}
        style={styles.cardListContainer}
      />
    );
  }
}
