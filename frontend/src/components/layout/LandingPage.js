import React from 'react';
import { ArrowDownIcon } from '../../Icons';
import devFocusImg from '../../img/undraw-dev-focus.svg';

const LandingPage = () => (
  <div className="h-screen bg-gray-900 text-gray-100 relative">
    <div className="h-full flex flex-col justify-center items-center px-2">
      <img
        className="w-11/12 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl"
        src={devFocusImg}
        alt="Logo"
      />
      <h1 className="text-3xl sm:text-4xl my-2 text-center select-none">
        Dev's Blogging Platform
      </h1>
      <button className="mt-2 bg-green-600 text-green-100 border border-green-500 py-2 px-4 rounded-lg uppercase focus:outline-none focus:shadow-outline hover:bg-green-700">
        Create a blog
      </button>
    </div>
    <div className="absolute bottom-0 left-0 text-center w-full flex justify-center mb-4">
      <ArrowDownIcon className="w-6 h-6 fill-current text-gray-600" />
    </div>
  </div>
);

export default LandingPage;
