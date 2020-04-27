import { useReducer, useCallback } from 'react';

const reducer = (previousState = {}, updatedState = {}) => {
  return { ...previousState, ...updatedState };
};

const useUseState = (initialState = {}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setState = useCallback(
    (updatedState) => {
      dispatch(updatedState);
    },
    [dispatch]
  );

  return [state, setState];
};

export default useUseState;
