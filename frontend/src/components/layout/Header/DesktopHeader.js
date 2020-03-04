import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DesktopNav } from '../Nav';
import { useUser } from '../../../context/UserContext';
import clsx from 'clsx';

const DesktopHeader = ({ headerScrolledAfterVHeight }) => {
  const { pathname } = useLocation();
  const user = useUser();

  const headerBgColor =
    pathname === '/' && !user && !headerScrolledAfterVHeight
      ? 'transparent'
      : 'bg-gray-800';
  return (
    <header className={clsx(`fixed w-full z-10 ${headerBgColor}`)}>
      <DesktopNav />
    </header>
  );
};

DesktopHeader.propTypes = {
  headerScrolledAfterVHeight: PropTypes.bool.isRequired
};

export default DesktopHeader;
