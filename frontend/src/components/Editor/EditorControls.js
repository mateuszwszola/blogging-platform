import React from 'react';
import PropTypes from 'prop-types';

function EditorControls({
  onBoldClick,
  onItalicClick,
  onUnderlineClick,
  onToggleCode,
}) {
  return (
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
  );
}

EditorControls.propTypes = {
  onBoldClick: PropTypes.func.isRequired,
  onItalicClick: PropTypes.func.isRequired,
  onUnderlineClick: PropTypes.func.isRequired,
  onToggleCode: PropTypes.func.isRequired,
};

export default EditorControls;
