import React from 'react';
import PropTypes from 'prop-types';

const blockTypeButtons = [
  {
    value: 'Heading One',
    block: 'header-one',
  },
  {
    value: 'Heading Two',
    block: 'header-two',
  },
  {
    value: 'Heading Three',
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

const InlineBlockButton = ({ value, handleMouseDown }) => (
  <input
    className="cursor-pointer m-2 py-1 px-2 bg-gray-500 text-gray-100 rounded"
    type="button"
    value={value}
    onMouseDown={handleMouseDown}
  />
);

InlineBlockButton.propTypes = {
  value: PropTypes.string.isRequired,
  handleMouseDown: PropTypes.func.isRequired,
};

function BlockTypeButtons({ toggleBlockType }) {
  return (
    <div>
      {blockTypeButtons.map(({ value, block }) => (
        <InlineBlockButton
          key={block}
          value={value}
          handleMouseDown={toggleBlockType(block)}
        />
      ))}
    </div>
  );
}

BlockTypeButtons.propTypes = {
  toggleBlockType: PropTypes.func.isRequired,
};

export default BlockTypeButtons;
