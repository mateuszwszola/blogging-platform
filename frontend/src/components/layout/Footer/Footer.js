import React from 'react';
import { GithubIcon } from '../../../icons';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-6 px-4 mt-auto">
      <div className="flex flex-col sm:flex-row justify-center items-center">
        <p className="text-sm text-gray-300 uppercase tracking-wider text-center">
          Mateusz Wszola
        </p>
        <div className="flex mt-2 sm:mt-0 sm:ml-2">
          <span className="text-gray-500">Source code on</span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 flex"
            href="https://github.com/mateuszwszola/blogging-platform"
          >
            <span className="ml-2">Github</span>
            <GithubIcon className="w-6 h-6 text-gray-300 fill-current mx-2" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
