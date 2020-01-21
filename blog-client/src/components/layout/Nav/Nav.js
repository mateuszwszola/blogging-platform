import React from 'react';
import clsx from 'clsx';

const Nav = ({ navNode, navOpen, setNavOpen }) => {
  const navClassnames = clsx(
    'flex flex-col justify-center items-center p-8 absolute top-0 left-0 h-screen w-full text-center bg-gray-100 text-gray-900 transform md:max-w-sm',
    { 'translate-x-0': navOpen, '-translate-x-full': !navOpen }
  );
  return (
    <nav ref={navNode} className={navClassnames}>
      <div className="absolute top-0 left-0 m-4">
        <button
          className="p-2 font-bold text-2xl"
          onClick={() => setNavOpen(false)}
        >
          X
        </button>
      </div>
      <span className="flex items-center my-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path
            className="heroicon-ui"
            d="M13 20v-5h-2v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7.59l-.3.3a1 1 0 1 1-1.4-1.42l9-9a1 1 0 0 1 1.4 0l9 9a1 1 0 0 1-1.4 1.42l-.3-.3V20a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2zm5 0v-9.59l-6-6-6 6V20h3v-5c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v5h3z"
          />
        </svg>
        <a href="#" className="ml-2">
          Home
        </a>
      </span>
      <span className="flex items-center my-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path
            className="heroicon-ui"
            d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z"
          />
        </svg>
        <a href="#" className="ml-2">
          Log In
        </a>
      </span>
      <span className="flex items-center my-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path
            className="heroicon-ui"
            d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z"
          />
        </svg>
        <a href="#" className="ml-2">
          Sign In
        </a>
      </span>
    </nav>
  );
};

export default Nav;
