import React, {Component} from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {Caption, Card, IconButton, Title} from 'react-native-paper';
import {AuthHelper} from '../../../../db/AuthHelper';

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
    fontSize: 14,
  },
});

export default class DeckList extends Component {
  render() {
    return (
      <FlatList
        data={this.props.decks}
        renderItem={listItem => {
          return (
            <Card
              key={listItem.item.id}
              style={styles.card}
              onPress={() => this.props.onDeckPress(listItem.item)}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardDescription}>
                  <Title>{listItem.item.name}</Title>
                  <Caption style={styles.cardCount}>
                    {listItem.item.cards.length} Karten
                  </Caption>
                </View>
                <View style={styles.cardActions}>
                  <IconButton
                    icon="play-circle"
                    size={20}
                    onPress={() => this.props.onLearn(listItem.item)}
                  />
                  {listItem.item.ownerId === AuthHelper.userId() && (
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => {
                        this.props.onEdit(listItem.item);
                      }}
                    />
                  )}
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
