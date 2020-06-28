import {useState} from 'react';

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
