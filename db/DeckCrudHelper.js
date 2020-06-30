import firestore from '@react-native-firebase/firestore';

export class DeckCrudHelper {
  static useCreateDeck(deck, onResult) {
    firestore()
      .collection('decks')
      .add(deck)
      .then(() => {
        onResult(true);
      })
      .catch(() => {
        onResult(false);
      });
  }

  static useUpdateDeck(deck, onResult) {
    const id = '' + deck.id;
    delete deck.id;

    firestore()
      .collection('decks')
      .doc(id)
      .set(deck)
      .then(() => {
        onResult(true);
      })
      .catch(() => {
        onResult(false);
      });
  }

  static useAddCardToDeck(deck, card, onResult) {
    deck.cards.push(card);

    this.useUpdateDeck(deck, onResult);
  }

  static useUpdateCardInDeck(deck, card, onResult) {
    const index = deck.cards.findIndex(foundCard => foundCard.id === card.id);
    if (index === -1) {
      onResult(false);
      return;
    }
    deck.cards[index] = card;

    this.useUpdateDeck(deck, onResult);
  }

  static useShareDeck(deck, newShareMail, onResult) {
    if (deck.shares.includes(newShareMail)) {
      onResult(false);
      return;
    }

    deck.shares.push(newShareMail);

    this.useUpdateDeck(deck, onResult);
  }

  static useUnshareDeck(deck, shareMail, onResult) {
    if (!deck.shares.includes(shareMail)) {
      onResult(false);
      return;
    }

    let index = deck.shares.indexOf(shareMail);
    if (index !== -1) {
      deck.shares.splice(index, 1);
      this.useUpdateDeck(deck, onResult);
      return;
    }

    onResult(false);
  }
}
