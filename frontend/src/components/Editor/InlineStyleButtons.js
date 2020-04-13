import React from 'react';
import PropTypes from 'prop-types';

const inlineStyleButtons = [
  {
    value: 'B',
    style: 'BOLD',
  },
  {
    value: 'I',
    style: 'ITALIC',
  },
  {
    value: 'U',
    style: 'UNDERLINE',
  },
  {
    value: 'S',
    style: 'STRIKETHROUGH',
  },
  {
    value: 'Code',
    style: 'CODE',
  },
];

const InlineStyleButton = ({ value, handleMouseDown }) => (
  <input
    className="cursor-pointer m-2 py-1 px-2 bg-gray-500 text-gray-100 rounded"
    type="button"
    value={value}
    onMouseDown={handleMouseDown}
  />
);

InlineStyleButton.propTypes = {
  value: PropTypes.string.isRequired,
  handleMouseDown: PropTypes.func.isRequired,
};

function InlineStyleButtons({ toggleInlineStyle }) {
  return (
    <div>
      {inlineStyleButtons.map(({ value, style }) => (
        <InlineStyleButton
          key={style}
          value={value}
          handleMouseDown={toggleInlineStyle(style)}
        />
      ))}
    </div>
  );
}

InlineStyleButtons.propTypes = {
  toggleInlineStyle: PropTypes.func.isRequired,
};

export default InlineStyleButtons;
