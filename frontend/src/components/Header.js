import React from 'react';
import useWindowWidth from 'hooks/useWindowWidth';
import Mobile from 'components/header/Mobile';
import Desktop from 'components/header/Desktop';

const Header = () => {
  const windowWidth = useWindowWidth();

  return windowWidth < 768 ? <Mobile /> : <Desktop />;
};

export default Header;
