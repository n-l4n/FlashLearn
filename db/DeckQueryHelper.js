import firestore from '@react-native-firebase/firestore';
import {Deck} from './Deck';
import {AuthHelper} from './AuthHelper';
import DeckComplaint from './DeckComplaint';

export class DeckQueryHelper {
  static findDecks(onResult, onError) {
    const userId = AuthHelper.userId();
    const userMail = AuthHelper.userMail();

    let ownDecks = null;
    let sharedDecks = null;

    firestore()
      .collection('decks')
      .where('ownerId', '==', userId)
      .onSnapshot(snapshot => {
        ownDecks = DeckQueryHelper.getDecksFromQuerySnapshot(snapshot);
        if (sharedDecks) {
          onResult(ownDecks.concat(sharedDecks));
        }
      }, onError);

    firestore()
      .collection('decks')
      .where('shares', 'array-contains', userMail)
      .onSnapshot(snapshot => {
        sharedDecks = this.getDecksFromQuerySnapshot(snapshot);
        if (ownDecks) {
          onResult(ownDecks.concat(sharedDecks));
        }
      }, onError);
  }

  static getDecksFromQuerySnapshot(snapshot) {
    const decks = [];
    if (snapshot && snapshot._docs) {
      for (const json of snapshot._docs) {
        json._data.id = json.id;
        decks.push(Deck.fromJSON(json._data));
      }
    }
    return decks;
  }

  static findDeckComplaints(decks, onResult, onError) {
    let query = firestore().collection('complaints').where('isDone', '==', false);
    let whereCount = 0;
    for (const deck of decks) {
      if (!deck.ownerId === AuthHelper.userId()) {
        continue;
      }
      query = query.where('deckId', '==', deck.id);
      whereCount++;
    }
    if (whereCount === 0) {
      onResult([]);
      return;
    }
    query.onSnapshot(snapshot => {
      if (snapshot && snapshot._docs) {
        const complaints = [];
        for (const json of snapshot._docs) {
          json._data.id = json.id;
          complaints.push(DeckComplaint.fromJSON(json._data));
        }
        onResult(complaints);
      } else {
        onResult([]);
      }
    }, onError);
  }

  static findDeckById(id, onResult, onError) {
    return firestore()
      .collection('decks')
      .doc(id)
      .onSnapshot(snapshot => {
        if (snapshot && snapshot._data) {
          let json = snapshot._data;
          json.id = snapshot.id;
          onResult(Deck.fromJSON(json));
        } else {
          onResult(null);
        }
      }, onError);
  }

  static useDeckById(id, onResult, onError) {
    firestore()
      .collection('decks')
      .doc(id)
      .onSnapshot(snapshot => {
        if (snapshot && snapshot._data) {
          let json = snapshot._data;
          json.id = snapshot.id;
          onResult(Deck.fromJSON(json));
        } else {
          onResult(null);
        }
      }, onError);
  }

  static useDeckCardById(id, onResult, onError) {
    firestore()
      .collection('decks')
      .doc(id)
      .onSnapshot(snapshot => {
        if (snapshot && snapshot._data) {
          let json = snapshot._data;
          json.id = snapshot.id;
          onResult(Deck.fromJSON(json));
        } else {
          onResult(null);
        }
      }, onError);
  }
}
