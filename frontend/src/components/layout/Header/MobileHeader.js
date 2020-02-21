import React from 'react';
import PropTypes from 'prop-types';
import { MenuIcon, CloseIcon } from '../../../Icons';
import { MobileNav } from '../Nav';

const MobileHeader = ({
  navNode,
  navOpen,
  setNavOpen,
  burgerScrolledAfterVHeight
}) => {
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
              <CloseIcon className="w-6 h-6 fill-current text-gray-400" />
            ) : (
              <MenuIcon
                className={`w-6 h-6 fill-current ${
                  burgerScrolledAfterVHeight ? 'text-gray-900' : 'text-gray-100'
                }`}
              />
            )}
          </button>
        </div>
        <MobileNav navOpen={navOpen} setNavOpen={setNavOpen} />
      </div>
    </header>
  );
};

MobileHeader.propTypes = {
  navNode: PropTypes.object.isRequired,
  navOpen: PropTypes.bool.isRequired,
  setNavOpen: PropTypes.func.isRequired,
  burgerScrolledAfterVHeight: PropTypes.bool.isRequired
};

export default MobileHeader;
