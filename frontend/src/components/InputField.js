import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const InputField = ({
  isError,
  value,
  handleChange,
  type,
  classnames,
  ...props
}) => (
  <input
    className={clsx(
      isError &&
        'border-2 border-red-500 focus:shadow-none focus:border-red-300',
      classnames,
      'w-full rounded py-2 px-4 outline-none focus:shadow-outline'
    )}
    type={type}
    value={value}
    onChange={handleChange}
    {...props}
  />
);

InputField.defaultProps = {
  type: 'text',
};

InputField.propTypes = {
  isError: PropTypes.bool,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  classnames: PropTypes.string,
};

export default InputField;
