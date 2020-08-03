import { useReducer } from 'react';
import { EditorState, convertFromRaw } from 'draft-js';

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
    If initialState (raw editorState -  stored in db or persisted in localStorage)
    is provided, create state with that content
  */
  if (initialState) {
    let editorState;
    try {
      const parsed = JSON.parse(initialState);
      if (parsed.content) {
        editorState = EditorState.createWithContent(
          convertFromRaw(parsed.content)
        );
      } else {
        editorState = EditorState.createEmpty();
      }
    } catch (err) {
      editorState = EditorState.createEmpty();
    }

    return {
      editorState,
    };
  }

  return {
    editorState: EditorState.createEmpty(),
  };
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
