import React, { useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { RichUtils } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import initializePlugins from 'components/contentEditor/plugins/initializePlugins';
import keyBindingFunction from 'components/contentEditor/helpers/keyBindingFunction';
import blockStyleFunctionCreator from 'components/contentEditor/helpers/blockStyleFunctionCreator';
import keyCommandReducer from 'components/contentEditor/helpers/keyCommandReducer';
import styleMap from 'components/contentEditor/helpers/styleMap';
import BlockTypeButtons from 'components/contentEditor/BlockTypeButtons';
import InlineStyleButtons from 'components/contentEditor/InlineStyleButtons';
import Loading from 'components/Loading';

import 'draft-js/dist/Draft.css';
import 'draft-js-linkify-plugin/lib/plugin.css';
import 'draft-js-hashtag-plugin/lib/plugin.css';
import 'draft-js-emoji-plugin/lib/plugin.css';
import styles from 'components/contentEditor/Editor.module.css';

const { plugins, EmojiSuggestions, EmojiSelect } = initializePlugins();
const blockStyleFunction = blockStyleFunctionCreator(styles);

function ContentEditor({ editorState, updateEditorState, isError }) {
  const editorRef = useRef(null);

  const focus = () => {
    editorRef.current.focus();
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = keyCommandReducer(editorState, command);
    if (newState) {
      updateEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style) => (e) => {
    e.preventDefault();
    updateEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (block) => (e) => {
    e.preventDefault();
    updateEditorState(RichUtils.toggleBlockType(editorState, block));
  };

  const currentInlineStyle = editorState.getCurrentInlineStyle();
  const currentBlockType = RichUtils.getCurrentBlockType(editorState);
  const contentState = editorState.getCurrentContent();

  let showPlaceholder = false;
  if (
    !contentState.hasText() &&
    contentState.getBlockMap().first().getType() === 'unstyled'
  ) {
    showPlaceholder = true;
  }

  if (!editorState) {
    return (
      <div className="relative h-64">
        <Loading />
      </div>
    );
  }

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

      <div
        onClick={focus}
        className={clsx(
          styles.editor,
          {
            [styles.hidePlaceholder]: !showPlaceholder,
          },
          {
            [styles.error]: isError,
          }
        )}
      >
        <Editor
          ref={editorRef}
          placeholder="Enter some text..."
          editorState={editorState}
          onChange={updateEditorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={keyBindingFunction}
          customStyleMap={styleMap}
          blockStyleFn={blockStyleFunction}
          plugins={plugins}
        />
        <EmojiSuggestions />
      </div>
      <div className={styles.options}>
        <EmojiSelect />
      </div>
    </div>
  );
}

ContentEditor.propTypes = {
  editorState: PropTypes.object.isRequired,
  updateEditorState: PropTypes.func.isRequired,
};

export default ContentEditor;
