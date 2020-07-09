import {useState} from 'react';
import {DeckCard} from './app/db/DeckCard';

export class BaseState {
  loading;
  error;

  setLoading: () => {};
  setError: () => {};
}

export class BaseDeckState extends BaseState {
  deck;

  setDeck: () => {};
}

function useBaseStateImpl(baseState: BaseState) {
  [baseState.error, baseState.setError] = useState('');
  [baseState.loading, baseState.setLoading] = useState('');
  return baseState;
}

export function useBaseState() {
  return useBaseStateImpl(new BaseState());
}

export function useDeckBaseState(): BaseDeckState {
  const baseState = useBaseStateImpl(new BaseDeckState());
  [baseState.deck, baseState.setDeck] = useState(null);
  return baseState;
}

export class BaseCardState {
  question = '';
  answer = '';
  card = new DeckCard();
  picture = null;
  recording = null;
  listItems = [];
  multipleChoiceItems = [];
  isTakingPicture = false;
  isUploadingPicture = false;
  isRecordingAudio = false;
  isUploadingAudio = false;
  isAddingListItems = false;
  isAddingMultipleChoiceItems = false;
}
