import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  Modifier,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import keyBindingFunction from 'components/contentEditor/helpers/keyBindingFunction';
import blockStyleFunctionCreator from 'components/contentEditor/helpers/blockStyleFunctionCreator';
import keyCommandReducer from 'components/contentEditor/helpers/keyCommandReducer';
import styleMap from 'components/contentEditor/helpers/styleMap';
import InlineStyleButtons from 'components/contentEditor/InlineStyleButtons';
import BlockTypeButtons from 'components/contentEditor/BlockTypeButtons';
import CustomEmojiPicker from 'components/contentEditor/CustomEmojiPicker';
import styles from 'components/contentEditor/Editor.module.css';

const blockStyleFunction = blockStyleFunctionCreator(styles);

function insertCharacter(characterToInsert, editorState) {
  const currentContent = editorState.getCurrentContent();
  const currentSelection = editorState.getSelection();

  const newContent = Modifier.replaceText(
    currentContent,
    currentSelection,
    characterToInsert
  );

  const newEditorState = EditorState.push(
    editorState,
    newContent,
    'insert-characters'
  );

  return EditorState.forceSelection(
    newEditorState,
    newContent.getSelectionAfter()
  );
}

function TextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const contentState = editorState.getCurrentContent();

  let showPlaceholder = false;
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() === 'unstyled') {
      showPlaceholder = true;
    }
  }

  const editorRef = useRef(null);

  const focusEditor = () => editorRef.current.focus();

  useEffect(() => {
    const logState = () => {
      const content = editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };
    logState();
  }, [editorState]);

  const handleKeyCommand = (command, editorState) => {
    const newState = keyCommandReducer(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style) => (e) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (block) => (e) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleBlockType(editorState, block));
  };

  const currentInlineStyle = editorState.getCurrentInlineStyle();
  const currentBlockType = RichUtils.getCurrentBlockType(editorState);

  const onEmojiClick = (e) => {
    let emoji = e.currentTarget.getAttribute('data-emoji');
    setEditorState(insertCharacter(emoji, editorState));
  };

  return (
    <div>
      <BlockTypeButtons
        toggleBlockType={toggleBlockType}
        currentBlockType={currentBlockType}
      />

      <InlineStyleButtons
        toggleInlineStyle={toggleInlineStyle}
        currentInlineStyle={currentInlineStyle}
      />

      <CustomEmojiPicker onEmojiClick={onEmojiClick} />

      <div
        onClick={focusEditor}
        className={clsx(styles.editor, {
          [styles.hidePlaceholder]: !showPlaceholder,
        })}
      >
        <Editor
          customStyleMap={styleMap}
          blockStyleFn={blockStyleFunction}
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={keyBindingFunction}
          placeholder="Enter some text..."
        />
      </div>
    </div>
  );
}

export default TextEditor;
