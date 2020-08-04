import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

const InputSubmit = ({ value, classnames, ...props }) => {
  return (
    <Button
      {...props}
      type="submit"
      size="base"
      version="auth"
      fullWidth
      fullRounded
      disabled={props.disabled}
    >
      <span className="uppercase">{value}</span>
    </Button>
  );
};

InputSubmit.propTypes = {
  value: PropTypes.string.isRequired,
};

export default InputSubmit;
