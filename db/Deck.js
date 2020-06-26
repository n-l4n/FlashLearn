export class Deck {
  id;
  ownerId;
  name;
  shares;
  cards;

  static fromName(name) {
    const deck = new Deck();
    deck.name = name;
    return deck;
  }

  static fromJSON(json) {
    const deck = new Deck();
    deck.id = json.id;
    deck.ownerId = json.ownerId;
    deck.name = json.name;
    deck.shares = 'shares' in json ? json.shares : [];
    deck.cards = 'cards' in json ? json.cards : [];
    return deck;
  }
}
