import React from 'react';
import PropTypes from 'prop-types';
import { convertFromRaw, EditorState, Editor } from 'draft-js';

function EditorContentPreview({ body }) {
  const contentState = convertFromRaw(JSON.parse(body).content);
  const editorState = EditorState.createWithContent(contentState);

  return <Editor editorState={editorState} readOnly={true} />;
}

EditorContentPreview.propTypes = {
  body: PropTypes.string.isRequired,
};

export default EditorContentPreview;
