import { useReducer } from 'react';

const defaultState = {
  editorState: null,
};

const UPDATE_EDITOR_STATE = 'UPDATE_EDITOR_STATE';

function reducer(state, { type, payload }) {
  if (type === UPDATE_EDITOR_STATE) {
    return {
      ...state,
      editorState: payload,
    };
  }

  return state;
}

function useEditorState(initialState = defaultState) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateEditorState = (editorState) => {
    dispatch({
      type: UPDATE_EDITOR_STATE,
      payload: editorState,
    });
  };

  return {
    editorState: state.editorState,
    updateEditorState,
  };
}

export default useEditorState;
