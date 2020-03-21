import React from 'react';
import PropTypes from 'prop-types';
import InputField from './InputField';

const InputGroup = ({
  isError,
  errors,
  value,
  handleChange,
  icon: Icon,
  name,
  classnames,
  label,
  ...props
}) => {
  return (
    <div className="my-2 sm:my-3">
      <label className="relative">
        <span
          className={`text-sm uppercase text-gray-800 font-semibold${
            !label ? ' visually-hidden' : ''
          }`}
        >
          {label || name}
        </span>
        <InputField
          isError={isError}
          value={value}
          handleChange={handleChange}
          name={name}
          {...props}
          classnames={`${classnames} ${Icon ? 'pl-10' : ''}`}
        />
        {Icon && (
          <div className="absolute top-0 left-0 bottom-0 flex items-center p-2 pl-3 text-gray-400">
            <Icon className="w-4 h-4 fill-current" />
          </div>
        )}
      </label>
      {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
    </div>
  );
};

InputGroup.defaultProps = {
  isError: false,
  errors: {}
};

InputGroup.propTypes = {
  isError: PropTypes.bool,
  errors: PropTypes.object,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  classnames: PropTypes.string,
  label: PropTypes.string
};

export default InputGroup;
