import firestore from '@react-native-firebase/firestore';
import DeckComplaint from './DeckComplaint';

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
      .catch(error => {
        console.log(error);
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

    firestore()
      .collection('decks')
      .doc(deck.id)
      .update({
        cards: firestore.FieldValue.arrayUnion(card),
      })
      .then(() => {
        onResult(true);
      })
      .catch(() => {
        onResult(false);
      });
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

  static sendDeckComplaint(deck, card, message, onResult) {
    const complaint = new DeckComplaint();
    complaint.deckId = deck.id;
    complaint.cardId = card.id;
    complaint.message = message;

    firestore()
      .collection('complaints')
      .add(complaint)
      .then(() => {
        onResult(true);
      })
      .catch(() => {
        onResult(false);
      });
  }

  static setDeckComplaintAsDone(complaint, onResult) {
    const id = complaint.id;
    delete complaint.id;
    complaint.isDone = true;

    firestore()
      .collection('complaints')
      .doc(id)
      .set(complaint)
      .then(() => {
        onResult(true);
      })
      .catch(() => {
        onResult(false);
      });
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
