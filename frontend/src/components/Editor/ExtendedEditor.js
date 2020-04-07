import React, { useState, useRef } from 'react';
import { EditorState, RichUtils } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createHashtagPlugin from 'draft-js-hashtag-plugin';
import 'draft-js/dist/Draft.css';
import 'draft-js-linkify-plugin/lib/plugin.css';
import 'draft-js-hashtag-plugin/lib/plugin.css';
import styles from './Editor.module.css';

const linkifyPlugin = createLinkifyPlugin();
const hashtagPlugin = createHashtagPlugin();
const plugins = [linkifyPlugin, hashtagPlugin];

function ExtendedEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const editor = useRef(null);

  const focus = () => {
    editor.current.focus();
  };

  const onKeyCommand = (command, editorState) => {
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
      <div className={styles.editor} onClick={focus}>
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={onKeyCommand}
          plugins={plugins}
        />
      </div>
    </div>
  );
}

export default ExtendedEditor;
