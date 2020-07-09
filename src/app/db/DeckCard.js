import {uuid} from 'uuidv4';
import {AuthHelper} from './AuthHelper';

export class DeckCard {
  id: string = uuid();
  box: {};
  question: string;
  answer: string;
  picture: string;
  recording: string;
  list: string[];
  multipleChoiceItems: MultipleChoiceItem[];

  constructor() {
    this.box = {};
    this.question = '';
    this.answer = '';
    this.picture = null;
    this.recording = null;
    this.list = null;
    this.multipleChoiceItems = null;
  }

  static fromJSON(json: any): DeckCard {
    const card = new DeckCard();

    card.id = json.id;
    card.question = json.question;
    card.answer = json.answer;
    card.box = 'box' in json ? json.box : {};
    card.picture = 'picture' in json ? json.picture : null;
    card.recording = 'recording' in json ? json.recording : null;
    card.list = 'list' in json ? json.list : null;
    card.multipleChoiceItems =
      'multipleChoiceItems' in json
        ? MultipleChoiceItem.fromJSON(json.multipleChoiceItems)
        : null;

    return card;
  }

  setCurrentBoxForUser(newBox: number) {
    const userId = AuthHelper.userId();
    this.box[userId] = newBox;
  }

  getCurrentBoxForUser() {
    const userId = AuthHelper.userId();
    return userId in this.box ? this.box[userId] : 0;
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
