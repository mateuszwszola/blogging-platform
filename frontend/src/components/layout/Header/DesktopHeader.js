import React from 'react';
import PropTypes from 'prop-types';
import { DesktopNav } from '../Nav';

const DesktopHeader = ({ headerScrolledAfterVHeight }) => {
  return (
    <header
      className={`fixed w-full z-10 ${
        headerScrolledAfterVHeight ? 'bg-gray-900' : 'transparent'
      }`}
    >
      <DesktopNav />
    </header>
  );
};

DesktopHeader.propTypes = {
  headerScrolledAfterVHeight: PropTypes.bool.isRequired
};

export default DesktopHeader;
