import { useCallback, useReducer, useEffect } from 'react';

const reducer = (state, action) => {
  if (action.type === 'started') {
    return {
      loading: true,
      error: null,
      result: null,
    };
  }
  if (action.type === 'success') {
    return {
      loading: false,
      error: null,
      result: action.payload.result,
    };
  }
  if (action.type === 'error') {
    return {
      loading: false,
      result: null,
      error: action.payload.error,
    };
  }
  return state;
};

const defaultFormatData = (result) => result;

const useAsync = ({
  promiseFn,
  immediate = false,
  data = null,
  formatData = defaultFormatData,
}) => {
  const initialState = {
    loading: immediate,
    error: null,
    result: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, error, result } = state;

  const run = useCallback(() => {
    const requestStarted = () => dispatch({ type: 'started' });
    const requestSuccessful = (result) =>
      dispatch({ type: 'success', payload: { result: formatData(result) } });
    const requestFailed = (error) =>
      dispatch({ type: 'error', payload: { error } });

    requestStarted();

    return promiseFn(data).then(requestSuccessful).catch(requestFailed);
  }, [promiseFn, data, formatData]);

  useEffect(() => {
    if (immediate) {
      run();
    }
  }, [run, immediate, data]);

  return { run, loading, error, result };
};

export default useAsync;
