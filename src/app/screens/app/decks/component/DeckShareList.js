import React, {Component} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {Avatar, IconButton, List} from 'react-native-paper';
import md5 from 'blueimp-md5';
import {appColors} from '../../../../../../theme';

const styles = StyleSheet.create({
  listItem: {
    alignItems: 'center',
  },
});

export default class DeckShareList extends Component {
  getProfileImageUrl(mail) {
    const hashedMail = md5(mail.trim().toLowerCase());
    return 'https://www.gravatar.com/avatar/' + hashedMail;
  }

  render() {
    return (
      <FlatList
        data={this.props.shares}
        keyExtractor={item => item}
        renderItem={listItem => {
          return (
            <List.Item
              key={listItem.item}
              title={listItem.item}
              style={styles.listItem}
              left={props => {
                return (
                  <Avatar.Image
                    {...props}
                    size={38}
                    source={{
                      uri: this.getProfileImageUrl(listItem.item),
                    }}
                  />
                );
              }}
              right={props => {
                return (
                  <IconButton
                    {...props}
                    icon="delete"
                    color={appColors.textIconColor}
                    size={24}
                    onPress={() => this.props.onDelete(listItem.item)}
                  />
                );
              }}
            />
          );
        }}
      />
    );
  }
}
