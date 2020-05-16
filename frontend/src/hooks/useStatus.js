import { useReducer } from 'react';

function statusReducer(state, action) {
  switch (action.type) {
    case 'started':
      return 'pending';
    case 'success':
      return 'resolved';
    case 'error':
      return 'rejected';
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function useStatus(initialStatus = 'idle') {
  const [status, dispatch] = useReducer(statusReducer, initialStatus);

  const requestFailed = () => dispatch({ type: 'error' });
  const requestStarted = () => dispatch({ type: 'started' });
  const requestSuccessful = () => dispatch({ type: 'success' });

  return {
    status,
    loading: status === 'pending',
    success: status === 'resolved',
    error: status === 'rejected',
    requestFailed,
    requestStarted,
    requestSuccessful,
  };
}

export default useStatus;
