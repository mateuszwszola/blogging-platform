import React, { useReducer, createContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SET_ALERT = 'SET_ALERT';
const REMOVE_ALERT = 'REMOVE_ALERT';

export const defaultAlerts = [
  {
    id: '1',
    alertType: 'success',
    msg: 'Post deleted',
  },
  {
    id: '2',
    alertType: 'error',
    msg: 'Cannot delete post',
  },
  {
    id: '3',
    alertType: 'error',
    msg: 'Server error',
  },
];

const initialState = [];

function reducer(state, action) {
  switch (action.type) {
    case SET_ALERT:
      return [action.payload.alert, ...state];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== action.payload.id);
    default:
      return state;
  }
}

const AlertContext = createContext();

function AlertProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setAlert = useCallback(
    (alertType, msg, alertTime = 2000) => {
      const id = uuidv4();
      const alert = { id, alertType, msg };

      dispatch({
        type: SET_ALERT,
        payload: { alert },
      });

      setTimeout(
        () => dispatch({ type: REMOVE_ALERT, payload: { id } }),
        alertTime
      );
    },
    [dispatch]
  );

  const removeAlert = useCallback(
    (id) => {
      console.log('clicked');
      dispatch({
        type: REMOVE_ALERT,
        payload: { id },
      });
    },
    [dispatch]
  );

  const value = React.useMemo(
    () => ({ alerts: state, setAlert, removeAlert }),
    [state, setAlert, removeAlert]
  );

  return <AlertContext.Provider value={value} {...props} />;
}

function useAlert() {
  const context = React.useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used withing a AlertProvider');
  }
  return context;
}

export { AlertProvider, useAlert };
