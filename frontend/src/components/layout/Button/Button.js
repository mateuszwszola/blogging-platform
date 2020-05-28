import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ButtonVersion, ButtonSize } from 'theme/button';

const Button = ({
  size,
  version,
  fullWidth,
  fullRounded,
  disabled,
  children,
  ...props
}) => {
  let classNames = ButtonVersion[version] + ' ' + ButtonSize[size];

  if (disabled) {
    classNames += ' ' + ButtonVersion.disabled;
  }

  return (
    <button
      {...props}
      className={clsx(classNames, {
        'w-full': !!fullWidth,
        'rounded-full': !!fullRounded,
      })}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  type: 'button',
  size: 'base',
  version: 'basic',
  fullWidth: false,
  fullRounded: false,
  disabled: false,
};

Button.propTypes = {
  size: PropTypes.oneOf(['sm', 'base', 'lg']),
  version: PropTypes.oneOf([
    'primary',
    'secondary',
    'auth',
    'basic',
    'delete',
    'edit',
  ]),
  fullWidth: PropTypes.bool,
  fullRounded: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Button;
