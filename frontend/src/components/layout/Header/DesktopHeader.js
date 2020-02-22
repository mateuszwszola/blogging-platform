import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DesktopNav } from '../Nav';

const DesktopHeader = ({ headerScrolledAfterVHeight }) => {
  const { pathname } = useLocation();

  const headerBgColor =
    pathname === '/' && !headerScrolledAfterVHeight
      ? 'transparent'
      : 'bg-gray-900';
  return (
    <header className={`fixed w-full z-10 ${headerBgColor}`}>
      <DesktopNav />
    </header>
  );
};

DesktopHeader.propTypes = {
  headerScrolledAfterVHeight: PropTypes.bool.isRequired
};

export default DesktopHeader;
