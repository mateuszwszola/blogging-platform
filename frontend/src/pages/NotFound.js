import React from 'react';
import { Link } from 'react-router-dom';
import notFoundImg from 'img/undraw_page_not_found.svg';

function NotFound() {
  return (
    <div className="flex-auto bg-gray-900 flex justify-center items-center">
      <div className="w-11/12 max-w-xs text-center px-2">
        <img src={notFoundImg} alt="Page not found" />
        <h1 className="text-gray-100 mt-2 py-2 text-2xl md:text-3xl">
          Page Not Found
        </h1>
        <Link
          to="/"
          className="text-red-400 text-gray-100 mt-2 text-lg md:text-xl"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
