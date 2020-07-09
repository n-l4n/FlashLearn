export default class DeckComplaint {
  id: string;
  ownerId: string;
  deckId: string;
  cardId: string;
  message: string;
  isDone: boolean;

  constructor() {
    this.id = null;
    this.ownerId = null;
    this.deckId = null;
    this.cardId = null;
    this.message = null;
    this.isDone = false;
  }

  static fromJSON(json): DeckComplaint {
    const complaint = new DeckComplaint();
    complaint.id = json.id;
    complaint.ownerId = json.ownerId;
    complaint.deckId = json.deckId;
    complaint.cardId = json.cardId;
    complaint.message = json.message;
    complaint.isDone = json.done;
    return complaint;
  }
}
