import React, { useState, useEffect, useRef } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  CompositeDecorator,
} from 'draft-js';
import styles from './Editor.module.css';
import 'draft-js/dist/Draft.css';

function TextEditor() {
  const compositeDecorator = new CompositeDecorator([
    {
      strategy: hashtagStrategy,
      component: HashtagSpan,
    },
    {
      strategy: linkStrategy,
      component: LinkSpan,
    },
  ]);

  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(compositeDecorator)
  );

  const editor = useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  useEffect(() => {
    focusEditor();
  }, []);

  useEffect(() => {
    const logState = () => {
      const content = editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };
    logState();
  }, [editorState]);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const onItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  };

  const onUnderlineClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  };

  const onToggleCode = () => {
    setEditorState(RichUtils.toggleCode(editorState));
  };

  return (
    <div>
      <div className="controls">
        <button className="inline-block mx-2" onClick={onBoldClick}>
          <strong>B</strong>
        </button>
        <button className="inline-block mx-2" onClick={onItalicClick}>
          <em>I</em>
        </button>
        <button className="inline-block mx-2" onClick={onUnderlineClick}>
          U
        </button>
        <button className="inline-block mx-2" onClick={onToggleCode}>
          Code Block
        </button>
      </div>

      <div onClick={focusEditor} className={styles.editor}>
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          placeholder="Enter some text..."
        />
      </div>
    </div>
  );
}

const HASHTAG_REGEX = /#[A-Za-z0-9]*/g;
const LINK_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;

function hashtagStrategy(contentBlock, callback, contentState) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

function linkStrategy(contentBlock, callback, contentState) {
  findWithRegex(LINK_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const HashtagSpan = (props) => {
  return (
    <span {...props} className="bg-blue-500 text-white p-1 rounded">
      {props.children}
    </span>
  );
};

const LinkSpan = (props) => {
  return (
    <span {...props} className="text-blue-500 font-bold">
      {props.children}
    </span>
  );
};

export default TextEditor;
