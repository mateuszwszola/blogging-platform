import { RichUtils } from 'draft-js';

const keyCommandReducer = (editorState, command) => {
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
      newState = RichUtils.toggleInlineStyle(editorState, 'ordered-list-item');
    }
    if (command === 'unordered-list') {
      newState = RichUtils.toggleInlineStyle(
        editorState,
        'unordered-list-item'
      );
    }
  }

  return newState;
};

export default keyCommandReducer;
