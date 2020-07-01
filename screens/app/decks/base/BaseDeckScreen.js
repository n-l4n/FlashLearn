import React from 'react';
import {DeckQueryHelper} from '../../../../db/DeckQueryHelper';
import {Deck} from '../../../../db/Deck';
import BaseContentLoadScreen from './BaseContentLoadScreen';

export class BaseDeckScreen extends BaseContentLoadScreen {
  deckSub;
  constructor(props) {
    super(props);
    this.state = this.buildBaseState();
  }

  buildBaseState() {
    return {
      ...super.buildBaseState(),
      ...this.buildCustomState(),
      deck: null,
    };
  }

  componentDidMount(): void {
    const deckId = this.getNavigationParam('deckId');
    if (deckId === null) {
      return;
    }
    if (deckId === 'new') {
      const deck = new Deck();
      this.onDeckLoaded(deck);
      this.state.deck = deck;
      this.setIsContentReady(true);
      return;
    }
    this.deckSub = DeckQueryHelper.findDeckById(
      deckId,
      deck => {
        if (!deck) {
          return;
        }
        this.onDeckLoaded(deck);
        this.state.deck = deck;
        this.setIsContentReady(true);
      },
      error => {
        console.log(error);
      },
    );
  }

  componentWillUnmount(): void {
    if (this.deckSub) {
      this.deckSub();
    }
  }

  buildCustomState() {
    return {};
  }

  onDeckLoaded(deck) {}

  getLoadingText(): string {
    return 'Deck laden...';
  }
}
