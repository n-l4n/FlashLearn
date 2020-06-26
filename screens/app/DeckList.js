import React, {Component} from 'react';
import {FlatList, StyleSheet, Dimensions, View} from 'react-native';
import {Card, Title, IconButton} from 'react-native-paper';

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
  },
});

export default class DeckList extends Component {
  render() {
    return (
      <FlatList
        data={this.props.decks}
        renderItem={listItem => {
          return (
            <Card key={listItem.item.id} style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Title>{listItem.item.name}</Title>
                <View style={styles.cardActions}>
                  <IconButton
                    icon="play-circle"
                    size={20}
                    onPress={() => console.log('Pressed')}
                  />
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => {
                      this.props.onEdit(listItem.item);
                    }}
                  />
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
