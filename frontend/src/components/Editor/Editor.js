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
import styles from './Editor.module.css';
import keyBindingFunction from './helpers/keyBindingFunction';
import blockStyleFunctionCreator from './helpers/blockStyleFunction';
import InlineStyleButtons from './InlineStyleButtons';
import BlockTypeButtons from './BlockTypeButtons';
import EmojiPicker from './EmojiPicker';

const styleMap = {
  HIGHLIGHT: {
    backgroundColor: 'yellow',
  },
};

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

  const editor = useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  useEffect(() => {
    const logState = () => {
      const content = editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };
    logState();
  }, [editorState]);

  const handleKeyCommand = (command, editorState) => {
    let newState = RichUtils.handleKeyCommand(editorState, command);

    if (!newState && command === 'highlight') {
      newState = RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT');
    }
    if (!newState && command === 'strikethrough') {
      newState = RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH');
    }

    if (!newState && command === 'blockquote') {
      newState = RichUtils.toggleInlineStyle(editorState, 'blockquote');
    }

    if (!newState && command === 'ordered-list') {
      newState = RichUtils.toggleInlineStyle(editorState, 'ordered-list-item');
    }

    if (!newState && command === 'unordered-list') {
      newState = RichUtils.toggleInlineStyle(
        editorState,
        'unordered-list-item'
      );
    }

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

      <EmojiPicker onEmojiClick={onEmojiClick} />

      <div
        onClick={focusEditor}
        className={clsx(styles.editor, {
          [styles.hidePlaceholder]: !showPlaceholder,
        })}
      >
        <Editor
          customStyleMap={styleMap}
          blockStyleFn={blockStyleFunction}
          ref={editor}
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

// const HASHTAG_REGEX = /#[A-Za-z0-9]*/g;
// const LINK_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;

// function hashtagStrategy(contentBlock, callback, contentState) {
//   findWithRegex(HASHTAG_REGEX, contentBlock, callback);
// }

// function linkStrategy(contentBlock, callback, contentState) {
//   findWithRegex(LINK_REGEX, contentBlock, callback);
// }

// function findWithRegex(regex, contentBlock, callback) {
//   const text = contentBlock.getText();
//   let matchArr, start;
//   while ((matchArr = regex.exec(text)) !== null) {
//     start = matchArr.index;
//     callback(start, start + matchArr[0].length);
//   }
// }

// const HashtagSpan = (props) => {
//   return (
//     <span className="bg-blue-500 text-white p-1 rounded">{props.children}</span>
//   );
// };

// const LinkSpan = (props) => {
//   return (
//     <span {...props} className="text-blue-500 font-bold">
//       {props.children}
//     </span>
//   );
// };

export default TextEditor;
