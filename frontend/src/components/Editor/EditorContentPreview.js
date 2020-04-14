import React from 'react';
import PropTypes from 'prop-types';
import { convertFromRaw, EditorState, Editor } from 'draft-js';
import blockStyleFunctionCreator from './helpers/blockStyleFunction';
import styles from './Editor.module.css';
import styleMap from './helpers/styleMap';

const blockStyleFunction = blockStyleFunctionCreator(styles);

function EditorContentPreview({ body }) {
  const contentState = convertFromRaw(JSON.parse(body).content);
  const editorState = EditorState.createWithContent(contentState);

  return (
    <Editor
      editorState={editorState}
      readOnly={true}
      blockStyleFn={blockStyleFunction}
      customStyleMap={styleMap}
    />
  );
}

EditorContentPreview.propTypes = {
  body: PropTypes.string.isRequired,
};

export default EditorContentPreview;
