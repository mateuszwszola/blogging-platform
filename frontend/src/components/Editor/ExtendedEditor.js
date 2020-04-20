import React, { useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { RichUtils } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import initializePlugins from './plugins/initializePlugins';
import keyBindingFunction from './helpers/keyBindingFunction';
import blockStyleFunctionCreator from './helpers/blockStyleFunction';
import styleMap from './helpers/styleMap';

import 'draft-js/dist/Draft.css';
import 'draft-js-linkify-plugin/lib/plugin.css';
import 'draft-js-hashtag-plugin/lib/plugin.css';
import 'draft-js-emoji-plugin/lib/plugin.css';
import styles from './Editor.module.css';

import BlockTypeButtons from './BlockTypeButtons';
import InlineStyleButtons from './InlineStyleButtons';
import Loading from '../Loading';

const { plugins, EmojiSuggestions, EmojiSelect } = initializePlugins();
const blockStyleFunction = blockStyleFunctionCreator(styles);

function ExtendedEditor({ editorState, updateEditorState, isError }) {
  const editor = useRef(null);

  const contentState = editorState.getCurrentContent();
  let showPlaceholder = false;
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() === 'unstyled') {
      showPlaceholder = true;
    }
  }

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
    let newState = RichUtils.handleKeyCommand(editorState, command);

    if (!newState) {
      if (command === 'highlight') {
        newState = RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT');
      }
      if (command === 'strikethrough') {
        newState = RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH');
      }
      if (command === 'blockquote') {
        newState = RichUtils.toggleInlineStyle(editorState, 'blockquote');
      }
      if (command === 'ordered-list') {
        newState = RichUtils.toggleInlineStyle(
          editorState,
          'ordered-list-item'
        );
      }
      if (command === 'unordered-list') {
        newState = RichUtils.toggleInlineStyle(
          editorState,
          'unordered-list-item'
        );
      }
    }

    if (newState) {
      updateEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlinestyle = (style) => (e) => {
    e.preventDefault();
    updateEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (block) => (e) => {
    e.preventDefault();
    updateEditorState(RichUtils.toggleBlockType(editorState, block));
  };

  const currentInlineStyle = editorState.getCurrentInlineStyle();
  const currentBlockType = RichUtils.getCurrentBlockType(editorState);

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
        toggleInlineStyle={toggleInlinestyle}
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
          ref={editor}
          placeholder="Enter some text..."
          editorState={editorState}
          onChange={onChange}
          handleKeyCommand={onKeyCommand}
          keyBindingFn={keyBindingFunction}
          customStyleMap={styleMap}
          blockStyleFn={blockStyleFunction}
          plugins={plugins}
        />
        <EmojiSuggestions />
        <EmojiSelect />
      </div>
    </div>
  );
}

ExtendedEditor.propTypes = {
  editorState: PropTypes.object.isRequired,
  updateEditorState: PropTypes.func.isRequired,
};

export default ExtendedEditor;
