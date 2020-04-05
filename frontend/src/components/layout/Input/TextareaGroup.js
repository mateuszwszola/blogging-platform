import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const TextareaGroup = ({
  isError,
  errors,
  value,
  handleChange,
  name,
  classnames,
  label,
  ...props
}) => {
  return (
    <div className="my-2 sm:my-3">
      <label>
        {label && (
          <span className="text-sm uppercase text-gray-800 font-semibold">
            {label}
          </span>
        )}
        <textarea
          {...props}
          value={value}
          onChange={handleChange}
          name={name}
          className={clsx(
            'bg-gray-100 w-full rounded py-2 px-4 outline-none focus:shadow-outline',
            isError &&
              'border-2 border-red-500 focus:shadow-none focus:border-red-200',
            classnames
          )}
        ></textarea>
      </label>
      {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
    </div>
  );
};

TextareaGroup.defaultProps = {
  isError: false,
  errors: {},
};

TextareaGroup.propTypes = {
  isError: PropTypes.bool,
  errors: PropTypes.object,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  classnames: PropTypes.string,
  label: PropTypes.string,
};

export default TextareaGroup;
