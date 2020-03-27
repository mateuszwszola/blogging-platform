import React from 'react';
import { MobileNav } from '../Nav';
import { MenuIcon, CloseIcon } from '../../../icons';

const MobileHeader = props => {
  const [navOpen, setNavOpen] = React.useState(false);

  const isExpanded = navOpen ? true : false;

  return (
    <header>
      <div className="fixed left-0 m-4 z-50">
        <button
          className="p-2 focus:outline-none"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle menu"
          aria-expanded={isExpanded}
        >
          {navOpen ? (
            <CloseIcon className="w-6 h-6 fill-current text-gray-500" />
          ) : (
            <MenuIcon className="w-6 h-6 fill-current text-gray-500" />
          )}
        </button>
      </div>
      <MobileNav navOpen={navOpen} setNavOpen={setNavOpen} />
    </header>
  );
};

export default MobileHeader;
