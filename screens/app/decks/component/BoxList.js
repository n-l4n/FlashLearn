import React, {Component} from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {Card, IconButton, Text, Title} from 'react-native-paper';
import {AuthHelper} from '../../../../db/AuthHelper';

const styles = StyleSheet.create({
  cardListContainer: {
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    flexGrow: 0,
  },
  card: {
    margin: 4,
  },
  half: {
    width: Dimensions.get('window').width / 2 - 8,
  },
  full: {
    width: Dimensions.get('window').width - 8,
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardCount: {
    color: 'rgba(0, 0, 0, .6)',
  },
});

export default class DeckList extends Component {
  render() {
    return (
      <FlatList
        data={[0, 1, 2, 3, 4]}
        keyExtractor={item => item.toString()}
        style={styles.cardListContainer}
        numColumns={2}
        renderItem={listItem => {
          const itemCount = this.props.deck.cards.filter(
            card => card.getCurrentBoxForUser() === listItem.item,
          ).length;
          return (
            <Card
              style={[
                styles.card,
                listItem.item === 4 ? styles.full : styles.half,
              ]}
              onPress={() => this.props.onBoxPress(listItem.item)}>
              <Card.Content style={styles.cardContent}>
                <Title>Box {listItem.item + 1}</Title>
                <Text style={styles.cardCount}>
                  {itemCount} {itemCount !== 1 ? 'Karten' : 'Karte'}
                </Text>
              </Card.Content>
            </Card>
          );
        }}
      />
    );
  }
}
