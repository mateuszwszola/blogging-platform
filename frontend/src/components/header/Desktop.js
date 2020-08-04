import React from 'react';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import { useUser } from 'context/UserContext';
import useScrolledAfterVHeight from 'hooks/useScrolledAfterVHeight';
import Nav from 'components/header/desktop/Nav';

const Desktop = (props) => {
  const { pathname } = useLocation();
  const { user } = useUser();
  const headerOffset = 75;
  const headerScrolledAfterVHeight = useScrolledAfterVHeight(headerOffset);

  const headerBgColor =
    pathname === '/' && !user && !headerScrolledAfterVHeight
      ? 'transparent'
      : 'bg-gray-900';
  return (
    <header className={clsx(`fixed w-full z-10 ${headerBgColor}`)}>
      <Nav />
    </header>
  );
};

export default Desktop;
