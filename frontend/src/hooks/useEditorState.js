import { useReducer } from 'react';
import { EditorState, convertFromRaw } from 'draft-js';

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

function init(initialState) {
  /* 
    If content (raw editorState - result from DB call or persisted localStorage content)
    is provided, create state with that content
  */
  if (initialState.content) {
    return {
      editorState: EditorState.createWithContent(
        convertFromRaw(JSON.parse(initialState.content))
      ),
    };
  } else {
    return {
      editorState: EditorState.createEmpty(),
    };
  }
}

function useEditorState(initialState = defaultState) {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  const updateEditorState = (editorState) => {
    dispatch({
      type: UPDATE_EDITOR_STATE,
      payload: editorState,
    });
  };

  const resetEditorState = () => {
    dispatch({
      type: UPDATE_EDITOR_STATE,
      payload: init(initialState).editorState,
    });
  };

  return {
    editorState: state.editorState,
    updateEditorState,
    resetEditorState,
  };
}

export default useEditorState;
