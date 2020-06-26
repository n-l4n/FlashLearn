import {useState} from 'react';

export class BaseState {
  loading;
  error;

  setLoading: () => {};
  setError: () => {};
}

export function useBaseState() {
  const baseState = new BaseState();
  [baseState.error, baseState.setError] = useState('');
  [baseState.loading, baseState.setLoading] = useState('');
  return baseState;
}
