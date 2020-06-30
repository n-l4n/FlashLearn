import React, {Component} from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {Card, IconButton, Text, Title} from 'react-native-paper';

const styles = StyleSheet.create({
  cardListContainer: {
    width: '100%',
    flexWrap: 'wrap',
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

export default class DeckList extends Component {
  render() {
    return (
      <FlatList
        data={[0, 1, 2, 3, 4]}
        style={styles.cardListContainer}
        renderItem={listItem => {
          return (
            <Card
              key={listItem.item.id}
              style={styles.card}
              onPress={() => this.props.onBoxPress(listItem.item)}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardDescription}>
                  <Title>Box {listItem + 1}</Title>
                  <Text style={styles.cardCount}>
                    {
                      this.props.deck.cards.filter(
                        card => card.box === listItem,
                      ).length
                    }{' '}
                    Karten
                  </Text>
                </View>
              </Card.Content>
            </Card>
          );
        }}
      />
    );
  }
}
