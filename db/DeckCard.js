import {uuid} from 'uuidv4';

export class DeckCard {
  id: string = uuid();
  question: string;
  answer: string;
  picture: string;
  recording: string;
  list: string[];
  multipleChoiceItems: MultipleChoiceItem[];

  static fromJSON(json: any): DeckCard {
    const card = new DeckCard();

    card.question = json.question;
    card.answer = json.answer;
    card.picture = 'picture' in json ? json.picture : null;
    card.recording = 'recording' in json ? json.recording : null;
    card.list = 'list' in json ? json.list : null;
    card.multipleChoiceItems =
      'multipleChoiceItems' in json
        ? MultipleChoiceItem.fromJSON(json.multipleChoiceItems)
        : null;

    return card;
  }
}

export class MultipleChoiceItem {
  isCorrect: boolean;
  text: string;

  static fromJSON(json: any): MultipleChoiceItem[] {
    const items = [];
    for (const jsonItem of json) {
      const item = new MultipleChoiceItem();
      item.isCorrect = jsonItem.isCorrect;
      item.text = jsonItem.text;
      items.push(item);
    }
    return items;
  }
}
