import { LOADING, ERROR } from './types';

export const setError = (error) => ({
  type: ERROR,
  payload: { error },
});

export const setLoading = () => ({
  type: LOADING,
});
