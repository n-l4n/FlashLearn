import {useEffect} from 'react';
import {DeckQueryHelper} from './DeckQueryHelper';
import {BaseDeckState} from '../../../BaseState';

export function useLoadDeck(deckId, baseState: BaseDeckState) {
  useEffect(() => {
    DeckQueryHelper.useDeckById(
      deckId,
      deck => {
        if (!deck) {
          return;
        }
        baseState.setDeck(deck);
      },
      error => {
        console.log(error);
      },
    );
  }, []);
}
