import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
// import debounce from 'lodash/debounce';
import { EditorState, convertToRaw, convertFromRaw, RichUtils } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import EditorControls from './EditorControls';
import Loading from '../Loading';
// import useEditorState from '../../hooks/useEditorState';
import initializePlugins from './plugins/initializePlugins';

import 'draft-js/dist/Draft.css';
import 'draft-js-linkify-plugin/lib/plugin.css';
import 'draft-js-hashtag-plugin/lib/plugin.css';
import 'draft-js-emoji-plugin/lib/plugin.css';
import styles from './Editor.module.css';

const { plugins, EmojiSuggestions, EmojiSelect } = initializePlugins();

function ExtendedEditor({ editorState, updateEditorState }) {
  const editor = useRef(null);

  const focus = () => {
    editor.current.focus();
  };

  // useEffect(() => {
  //   const content = window.localStorage.getItem('content');
  //   if (content) {
  //     updateEditorState(
  //       EditorState.createWithContent(convertFromRaw(JSON.parse(content)))
  //     );
  //   } else {
  //     updateEditorState(EditorState.createEmpty());
  //   }

  //   return () => {
  //     window.localStorage.removeItem('content');
  //   };
  // }, []);

  // const saveContentToLocalStorage = debounce((content) => {
  //   window.localStorage.setItem(
  //     'content',
  //     JSON.stringify(convertToRaw(content))
  //   );
  // }, 1000);

  const onChange = (editorState) => {
    // const contentState = editorState.getCurrentContent();
    // saveContentToLocalStorage(contentState);
    updateEditorState(editorState);
  };

  const onKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      updateEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const onBoldClick = () => {
    updateEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const onItalicClick = () => {
    updateEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  };

  const onUnderlineClick = () => {
    updateEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  };

  const onToggleCode = () => {
    updateEditorState(RichUtils.toggleCode(editorState));
  };

  if (!editorState) {
    return (
      <div className="relative">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <EditorControls
        onBoldClick={onBoldClick}
        onItalicClick={onItalicClick}
        onUnderlineClick={onUnderlineClick}
        onToggleCode={onToggleCode}
      />
      <div className={styles.editor} onClick={focus}>
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={onChange}
          handleKeyCommand={onKeyCommand}
          plugins={plugins}
        />
        <EmojiSuggestions />
        <EmojiSelect />
      </div>
    </>
  );
}

ExtendedEditor.propTypes = {
  updateEditorState: PropTypes.func.isRequired,
};

export default ExtendedEditor;
