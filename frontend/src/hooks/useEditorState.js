import { useReducer } from 'react';
import { EditorState, convertFromRaw } from 'draft-js';

const UPDATE_EDITOR_STATE = 'UPDATE_EDITOR_STATE';

const defaultState = {
  editorState: EditorState.createEmpty(),
};

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
    If initialState (raw editorState content from db or localStorage)
    is provided, create state with that content
  */
  if (initialState) {
    let editorState;
    try {
      const { content } = JSON.parse(initialState);
      if (content) {
        editorState = EditorState.createWithContent(convertFromRaw(content));
      } else {
        editorState = defaultState.editorState;
      }
    } catch (err) {
      editorState = defaultState.editorState;
    }

    return {
      editorState,
    };
  }

  return defaultState;
}

function useEditorState(initialState) {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  const editorStatePlainText = state.editorState
    .getCurrentContent()
    .getPlainText();

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
    editorStatePlainText,
  };
}

export default useEditorState;
