import { RichUtils, KeyBindingUtil } from 'draft-js';

const defaultStyles = {
  background: 'yellow',
  padding: '0 .3em',
};

export default (style = {}) => {
  return {
    customStyleMap: {
      HIGHLIGHT: {
        ...defaultStyles,
        ...style,
      },
    },
    keyBindingFn: (e) => {
      if (KeyBindingUtil.hasCommandModifier(e) && e.key === 'h') {
        return 'highlight';
      }
    },
    handleKeyCommand: (command, editorState, { setEditorState }) => {
      if (command === 'highlight') {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'));
        return true;
      }
    },
  };
};
