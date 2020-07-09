import React, {Component} from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {Card, Text} from 'react-native-paper';

const styles = StyleSheet.create({
  cardListContainer: {
    width: '100%',
  },
  card: {
    width: Dimensions.get('window').width / 2 - 8,
    margin: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cardDescription: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardText: {
    textAlign: 'center',
  },
  cardCount: {
    color: 'rgba(0, 0, 0, .6)',
  },
});

export default class DeckCardList extends Component {
  render() {
    return (
      <FlatList
        data={this.props.cards}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={listItem => {
          return (
            <Card
              key={listItem.item.id}
              style={styles.card}
              onPress={() => this.props.onCardPress(listItem.item)}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardDescription}>
                  <Text style={styles.cardText}>{listItem.item.question}</Text>
                </View>
              </Card.Content>
            </Card>
          );
        }}
        style={styles.cardListContainer}
      />
    );
  }
}
