import React, {Component} from 'react';
import {Dimensions, FlatList, StyleSheet} from 'react-native';
import {Caption, Card, Title} from 'react-native-paper';

export default class DeckList extends Component {
  styles = StyleSheet.create({
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
      fontSize: 14,
    },
  });

  render() {
    return (
      <FlatList
        data={[0, 1, 2, 3, 4]}
        keyExtractor={item => item.toString()}
        style={this.styles.cardListContainer}
        numColumns={2}
        renderItem={listItem => {
          const itemCount = this.props.deck.cards.filter(
            card => card.getCurrentBoxForUser() === listItem.item,
          ).length;
          return (
            <Card
              style={[
                this.styles.card,
                listItem.item === 4 ? this.styles.full : this.styles.half,
              ]}
              onPress={() => this.props.onBoxPress(listItem.item)}>
              <Card.Content style={this.styles.cardContent}>
                <Title>Box {listItem.item + 1}</Title>
                <Caption style={this.styles.cardCount}>
                  {itemCount} {itemCount !== 1 ? 'Karten' : 'Karte'}
                </Caption>
              </Card.Content>
            </Card>
          );
        }}
      />
    );
  }
}
