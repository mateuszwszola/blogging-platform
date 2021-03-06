import React from 'react';
import PropTypes from 'prop-types';

function CustomEmojiPicker({ onEmojiClick }) {
  return (
    <div>
      <h2>Insert Emoji!</h2>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={onEmojiClick}
        data-emoji="😘"
      >
        <span role="img" aria-label="kiss emoji">
          😘
        </span>
      </button>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={onEmojiClick}
        data-emoji="🤪"
      >
        <span role="img" aria-label="crazy emoji">
          🤪
        </span>
      </button>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={onEmojiClick}
        data-emoji="😎"
      >
        <span role="img" aria-label="cool emoji">
          😎
        </span>
      </button>
    </div>
  );
}

CustomEmojiPicker.propTypes = {
  onEmojiClick: PropTypes.func.isRequired,
};

export default CustomEmojiPicker;
