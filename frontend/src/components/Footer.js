import React from 'react';
import { GithubIcon } from 'icons';

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-2 sm:py-4 px-2 mt-auto flex-shrink-0">
      <div className="flex flex-col sm:flex-row justify-center items-center">
        <p className="text-sm text-gray-500 uppercase tracking-wider text-center sm:mr-4">
          Mateusz Wszola
        </p>
        <div className="flex mt-2 sm:mt-0">
          <span className="text-gray-600">Source code on</span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="flex text-gray-500"
            href="https://github.com/mateuszwszola/blogging-platform"
          >
            <span className="ml-2">Github</span>
            <GithubIcon className="w-6 h-6 text-gray-500 fill-current mx-2" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
