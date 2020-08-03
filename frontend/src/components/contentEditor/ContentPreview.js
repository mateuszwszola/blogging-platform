import React from 'react';
import PropTypes from 'prop-types';
import { convertFromRaw, EditorState, Editor } from 'draft-js';
import styleMap from 'components/contentEditor/helpers/styleMap';
import blockStyleFunctionCreator from 'components/contentEditor/helpers/blockStyleFunctionCreator';
import styles from 'components/contentEditor/Editor.module.css';

const blockStyleFunction = blockStyleFunctionCreator(styles);

function ContentPreview({ body }) {
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

ContentPreview.propTypes = {
  body: PropTypes.string.isRequired,
};

export default ContentPreview;
