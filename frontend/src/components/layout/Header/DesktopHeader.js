import React from 'react';
import { useLocation } from 'react-router-dom';
import { DesktopNav } from '../Nav';
import { useUser } from '../../../context/UserContext';
import { useScrolledAfterVHeight } from '../../../hooks';
import clsx from 'clsx';

const DesktopHeader = props => {
  const { pathname } = useLocation();
  const user = useUser();
  const headerOffset = 75;
  const headerScrolledAfterVHeight = useScrolledAfterVHeight(headerOffset);

  const headerBgColor =
    pathname === '/' && !user && !headerScrolledAfterVHeight
      ? 'transparent'
      : 'bg-gray-900';
  return (
    <header className={clsx(`fixed w-full z-10 ${headerBgColor}`)}>
      <DesktopNav />
    </header>
  );
};

export default DesktopHeader;
