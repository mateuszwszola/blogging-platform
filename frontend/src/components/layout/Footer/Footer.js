import React from 'react';
import { GithubIcon } from '../../../Icons';

const Footer = () => {
  return (
    <div className="bg-gray-900 text-gray-100 py-12 px-6">
      <div className="flex flex-col items-center">
        <p className="text-lg uppercase tracking-widest font-normal text-center">
          Mateusz Wszola
        </p>
        <div className="flex mt-2">
          <span className="text-gray-600">Source code on</span>
          <a
            className="text-gray-200"
            href="https://github.com/mateuszwszola/blogging-platform"
          >
            <span className="ml-2">Github</span>
          </a>
          <GithubIcon className="w-6 h-6 fill-current mx-2" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
