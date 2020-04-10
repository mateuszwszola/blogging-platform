import React from 'react';
import { useWindowWidth } from 'hooks';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';

const Header = () => {
  const windowWidth = useWindowWidth();

  return windowWidth < 768 ? <MobileHeader /> : <DesktopHeader />;
};

export default Header;
