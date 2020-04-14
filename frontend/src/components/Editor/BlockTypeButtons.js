import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const blockTypeButtons = [
  {
    value: 'H1',
    block: 'header-one',
  },
  {
    value: 'H2',
    block: 'header-two',
  },
  {
    value: 'H3',
    block: 'header-three',
  },
  {
    value: 'Blockquote',
    block: 'blockquote',
  },
  {
    value: 'Unordered List',
    block: 'unordered-list-item',
  },
  {
    value: 'Ordered List',
    block: 'ordered-list-item',
  },
];

const InlineBlockButton = ({ value, handleMouseDown, isActive }) => {
  return (
    <input
      className={clsx(
        'cursor-pointer m-2 py-1 px-4 text-gray-600 bg-transparent text-sm uppercase transform border-b-2 border-solid border-transparent',
        isActive
          ? 'font-bold text-gray-700 border-gray-700'
          : 'bg-transparent font-medium'
      )}
      type="button"
      value={value}
      onMouseDown={handleMouseDown}
    />
  );
};

InlineBlockButton.propTypes = {
  value: PropTypes.string.isRequired,
  handleMouseDown: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

function BlockTypeButtons({ toggleBlockType, currentBlockType }) {
  return (
    <div>
      <p className="font-semibold">Block Types</p>
      {blockTypeButtons.map(({ value, block }) => (
        <InlineBlockButton
          key={block}
          value={value}
          handleMouseDown={toggleBlockType(block)}
          isActive={currentBlockType === block}
        />
      ))}
    </div>
  );
}

BlockTypeButtons.propTypes = {
  toggleBlockType: PropTypes.func.isRequired,
  currentBlockType: PropTypes.string.isRequired,
};

export default BlockTypeButtons;
