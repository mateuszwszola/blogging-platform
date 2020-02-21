import React, { useState, useRef } from 'react';
import {
  useOnClickOutside,
  useScrolledAfterVHeight,
  useWindowWidth
} from '../../../hooks';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';

function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const navNode = useRef();
  useOnClickOutside(navNode, () => setNavOpen(false));

  const burgerMenuOffset = 28;
  const burgerScrolledAfterVHeight = useScrolledAfterVHeight(burgerMenuOffset);

  const headerOffset = 75;
  const headerScrolledAfterVHeight = useScrolledAfterVHeight(headerOffset);

  const windowWidth = useWindowWidth();

  if (windowWidth < 768) {
    return (
      <MobileHeader
        navNode={navNode}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        burgerScrolledAfterVHeight={burgerScrolledAfterVHeight}
      />
    );
  }

  return (
    <DesktopHeader headerScrolledAfterVHeight={headerScrolledAfterVHeight} />
  );
}

export default Header;
