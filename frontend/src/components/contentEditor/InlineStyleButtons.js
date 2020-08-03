import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

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
  {
    value: 'Highlight',
    style: 'HIGHLIGHT',
  },
];

const InlineStyleButton = ({ value, handleMouseDown, isActive }) => (
  <input
    className={clsx(
      'cursor-pointer m-2 py-1 px-4 rounded-lg text-gray-600 text-sm uppercase border-2 border-solid border-gray-400',
      isActive
        ? 'font-bold bg-gray-400 text-gray-700'
        : 'bg-transparent font-medium'
    )}
    type="button"
    value={value}
    onMouseDown={handleMouseDown}
  />
);

InlineStyleButton.propTypes = {
  value: PropTypes.string.isRequired,
  handleMouseDown: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

const InlineStyleButtons = ({ toggleInlineStyle, currentInlineStyle }) => (
  <div>
    <p className="font-semibold">Inline Styles</p>
    {inlineStyleButtons.map(({ value, style }) => {
      const isActive = currentInlineStyle.has(style);
      return (
        <InlineStyleButton
          key={style}
          value={value}
          handleMouseDown={toggleInlineStyle(style)}
          isActive={isActive}
        />
      );
    })}
  </div>
);

InlineStyleButtons.propTypes = {
  toggleInlineStyle: PropTypes.func.isRequired,
  currentInlineStyle: PropTypes.object.isRequired,
};

export default InlineStyleButtons;
