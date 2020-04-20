import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownIcon } from 'icons';
import landingBg from 'img/landing-bg.jpg';

const LandingPage = () => (
  <div
    style={{
      backgroundImage: `url(${landingBg})`, // Photo by Glenn Carstens-Peters on Unsplash
    }}
    className="bg-cover bg-center h-screen relative"
  >
    <div
      style={{ backgroundColor: 'rgba(26, 32, 44, 0.75)' }}
      className="h-full absolute top-0 left-0 bottom-0 right-0 text-gray-100"
    >
      <div className="h-full flex flex-col justify-center items-center px-2 fadein">
        <div className="my-3 text-center select-none">
          <h1 className="text-3xl sm:text-4xl md:text-5xl">
            Blogging Platform
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-gray-400 py-1 font-light">
            Create and manage your personal blog
          </p>
        </div>
        <Link
          to="/login"
          className="mt-2 bg-green-600 text-white border border-green-700 py-2 px-4 rounded-lg uppercase shadow focus:outline-none focus:shadow-outline hover:bg-green-700"
        >
          Create a blog
        </Link>
      </div>
      <div className="absolute bottom-0 left-0 text-center w-full flex justify-center mb-4">
        <ArrowDownIcon className="w-6 h-6 fill-current text-gray-600" />
      </div>
    </div>
  </div>
);

export default LandingPage;
