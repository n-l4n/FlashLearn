import firestore from '@react-native-firebase/firestore';
import {Deck} from './Deck';
import {AuthHelper} from './AuthHelper';

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
