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

    console.log(id);

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
}
