import React, { useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SET_ALERT = 'SET_ALERT';
const REMOVE_ALERT = 'REMOVE_ALERT';

const initialState = [];

function reducer(state, action) {
  switch (action.type) {
    case SET_ALERT:
      return [action.payload, ...state];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== action.payload);
    default:
      return state;
  }
}

const AlertContext = React.createContext();

function AlertProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setAlert = (alertType, msg, alertTime = 2000) => {
    const id = uuidv4();
    dispatch({
      type: SET_ALERT,
      payload: { id, alertType, msg }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), alertTime);
  };

  const removeAlert = id => {
    dispatch({
      type: REMOVE_ALERT,
      payload: id
    });
  };

  return (
    <AlertContext.Provider
      value={{ alerts: state, setAlert, removeAlert }}
      {...props}
    />
  );
}

function useAlert() {
  const context = React.useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used withing a AlertProvider');
  }
  return context;
}

export { AlertProvider, useAlert };
