import {useState} from 'react';
import {DeckCard} from './db/DeckCard';

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

export class BaseDeckCardState {
  question;
  answer;
  card;
  isTakingPicture;
  isUploadingPicture;
  isRecordingAudio;
  isUploadingAudio;

  setQuestion: () => {};
  setAnswer: () => {};
  setCard: () => {};
  setIsTakingPicture: () => {};
  setIsUploadingPicture: () => {};
  setIsRecordingAudio: () => {};
  setIsUploadingAudio: () => {};
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

export function useDeckCardBaseState(): BaseDeckCardState {
  const baseState = new BaseDeckCardState();
  [baseState.question, baseState.setQuestion] = useState('');
  [baseState.answer, baseState.setAnswer] = useState('');
  [baseState.card, baseState.setCard] = useState(new DeckCard());
  [baseState.isTakingPicture, baseState.setIsTakingPicture] = useState(false);
  [baseState.isUploadingPicture, baseState.setIsUploadingPicture] = useState(
    false,
  );
  [baseState.isRecordingAudio, baseState.setIsRecordingAudio] = useState(false);
  [baseState.isUploadingAudio, baseState.setIsUploadingAudio] = useState(false);
  return baseState;
}
