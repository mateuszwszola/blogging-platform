import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Nav } from '../Nav';
import { useOnClickOutside } from '../../../hooks';
import { MenuIcon, CloseIcon } from '../../../Icons';

const Header = ({ navNode, navOpen, setNavOpen }) => {
  const isExpanded = navOpen ? true : false;

  return (
    <header className="h-full">
      <div ref={navNode}>
        <div className="absolute left-0 m-4 z-10">
          <button
            className="p-2 focus:outline-none"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle menu"
            aria-expanded={isExpanded}
          >
            {navOpen ? (
              <CloseIcon className="w-6 h-6 fill-current text-gray-900" />
            ) : (
              <MenuIcon className="w-6 h-6 fill-current text-gray-100" />
            )}
          </button>
        </div>
        <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      </div>

      <div className="h-full flex justify-center items-center px-1">
        <h1 className="text-4xl text-center select-none">Blogging Platform</h1>
      </div>
    </header>
  );
};

Header.propTypes = {
  navNode: PropTypes.object.isRequired,
  navOpen: PropTypes.bool.isRequired,
  setNavOpen: PropTypes.func.isRequired
};

function HeaderContainer() {
  const [navOpen, setNavOpen] = useState(false);
  const navNode = useRef();
  useOnClickOutside(navNode, () => setNavOpen(false));

  return <Header navNode={navNode} navOpen={navOpen} setNavOpen={setNavOpen} />;
}

export default HeaderContainer;
