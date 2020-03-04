import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const InputSubmit = ({ value, classnames, ...props }) => {
  return (
    <input
      className={clsx(
        `w-full rounded-full py-2 px-4 uppercase bg-red-500 hover:bg-red-400 text-gray-900 font-semibold cursor-pointer focus:outline-none focus:shadow-outline`,
        classnames
      )}
      type="submit"
      value={value}
      {...props}
    />
  );
};

InputSubmit.propTypes = {
  value: PropTypes.string.isRequired
};

export default InputSubmit;
