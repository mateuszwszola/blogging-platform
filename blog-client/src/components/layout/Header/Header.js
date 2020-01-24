import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Nav } from '../Nav';
import { useOnClickOutside, useScrolledAfterVHeight } from '../../../hooks';
import { MenuIcon, CloseIcon } from '../../../Icons';

const Header = ({ navNode, navOpen, setNavOpen, scrolledAfterVHeight }) => {
  const isExpanded = navOpen ? true : false;

  return (
    <header>
      <div ref={navNode}>
        <div className="fixed left-0 m-4 z-20">
          <button
            className="p-2 focus:outline-none"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle menu"
            aria-expanded={isExpanded}
          >
            {navOpen ? (
              <CloseIcon className="w-6 h-6 fill-current text-gray-900" />
            ) : (
              <MenuIcon
                className={`w-6 h-6 fill-current ${
                  scrolledAfterVHeight ? 'text-black' : 'text-white'
                }`}
              />
            )}
          </button>
        </div>
        <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      </div>
    </header>
  );
};

Header.propTypes = {
  navNode: PropTypes.object.isRequired,
  navOpen: PropTypes.bool.isRequired,
  setNavOpen: PropTypes.func.isRequired,
  scrolledAfterVHeight: PropTypes.bool.isRequired
};

function HeaderContainer() {
  const [navOpen, setNavOpen] = useState(false);
  const navNode = useRef();
  useOnClickOutside(navNode, () => setNavOpen(false));

  const burgerMenuOffset = 28;
  const scrolledAfterVHeight = useScrolledAfterVHeight(burgerMenuOffset);

  return (
    <Header
      navNode={navNode}
      navOpen={navOpen}
      setNavOpen={setNavOpen}
      scrolledAfterVHeight={scrolledAfterVHeight}
    />
  );
}

export default HeaderContainer;
