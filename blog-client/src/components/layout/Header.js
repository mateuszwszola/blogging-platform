import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Nav from './Nav';
import { useOnClickOutside } from '../../hooks';

const Header = ({ navNode, navOpen, setNavOpen }) => (
    <header className="h-full">
        <div className={`absolute m-4 ${navOpen ? 'hidden' : 'block'}`}>
            <button className="p-2" onClick={() => setNavOpen(true)}>
                <svg className="w-8 h-8 fill-current text-gray-100 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path className="heroicon-ui" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/></svg>
            </button>
        </div>
        <Nav 
            navNode={navNode}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
        />
        <div className="h-full flex justify-center items-center px-1">
            <h1 className="text-4xl text-center">Blogging Platform</h1>
        </div>
    </header>
)

Header.propTypes = {
    navNode: PropTypes.object.isRequired,
    navOpen: PropTypes.bool.isRequired,
    setNavOpen: PropTypes.func.isRequired
};

function HeaderContainer() {
    const [navOpen, setNavOpen] = useState(false);
    const navNode = useRef();
    useOnClickOutside(navNode, () => setNavOpen(false));

    return (
        <Header 
            navNode={navNode}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
        />
    )
}

export default HeaderContainer;