import {authStyles} from '../../../auth/AuthStyles';
import {Appbar} from 'react-native-paper';
import React from 'react';
import BaseContentLoadScreen from '../../decks/base/BaseContentLoadScreen';
import {DeckQueryHelper} from '../../../../db/DeckQueryHelper';
import DeckComplaintList from '../component/DeckComplaintList';
import {DeckCrudHelper} from '../../../../db/DeckCrudHelper';
import EmptyState from '../../decks/component/EmptyState';

export class NotificationScreen extends BaseContentLoadScreen {
  constructor(props) {
    super(props);
    this.state = this.buildBaseState();
  }

  buildBaseState() {
    return {
      ...super.buildBaseState(),
      complaints: [],
    };
  }

  componentDidMount() {
    DeckQueryHelper.findDecks(
      decks => {
        DeckQueryHelper.findDeckComplaints(
          decks,
          complaints => {
            this.state.complaints = complaints;
            this.setIsContentReady(true);
          },
          err => {},
        );
      },
      err => {},
    );
  }

  buildAppbar() {
    return (
      <Appbar.Header style={authStyles.appBar}>
        <Appbar.Content title="Nachrichten" />
      </Appbar.Header>
    );
  }

  buildContent() {
    return (
      <>
        {this.state.complaints.length > 0 ? (
          <DeckComplaintList
            complaints={this.state.complaints}
            onOpen={complaint => {
              this.navigation.navigate('NewDeckCard', {
                deckId: complaint.deckId,
                cardId: complaint.cardId,
              });
            }}
            onDone={complaint => {
              DeckCrudHelper.setDeckComplaintAsDone(complaint, success => {});
            }}
          />
        ) : (
          <EmptyState text={'Alle Nachrichten erledigt'} icon={'check-all'} />
        )}
      </>
    );
  }

  getLoadingText(): string {
    return 'Nachrichten laden...';
  }
}
