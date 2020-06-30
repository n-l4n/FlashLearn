import firestore from '@react-native-firebase/firestore';

export class DeckCrudHelper {
  static createDeck(deck, onResult) {
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

  static updateDeck(deck, onResult) {
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

  static deleteDeck(deck, onResult) {
    const id = '' + deck.id;
    delete deck.id;

    firestore()
        .collection('decks')
        .doc(id)
        .delete(deck)
        .then(() => {
          onResult(true);
        })
        .catch(() => {
          onResult(false);
        });
  }

  static addCardToDeck(deck, card, onResult) {
    deck.cards.push(card);

    this.updateDeck(deck, onResult);
  }

  static updateCardInDeck(deck, card, onResult) {
    const index = deck.cards.findIndex(foundCard => foundCard.id === card.id);
    if (index === -1) {
      onResult(false);
      return;
    }
    deck.cards[index] = card;

    this.updateDeck(deck, onResult);
  }

    static deleteCardInDeck(deck, card, onResult) {
        const index = deck.cards.findIndex(foundCard => foundCard.id === card.id);
        if (index === -1) {
            onResult(false);
            return;
        }
        deck.cards.splice(index, 1);

        this.updateDeck(deck, onResult);
    }

  static shareDeck(deck, newShareMail, onResult) {
    if (deck.shares.includes(newShareMail)) {
      onResult(false);
      return;
    }

    deck.shares.push(newShareMail);

    this.updateDeck(deck, onResult);
  }

  static unshareDeck(deck, shareMail, onResult) {
    if (!deck.shares.includes(shareMail)) {
      onResult(false);
      return;
    }

    let index = deck.shares.indexOf(shareMail);
    if (index !== -1) {
      deck.shares.splice(index, 1);
      this.updateDeck(deck, onResult);
      return;
    }

    onResult(false);
  }
}
