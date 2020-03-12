import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

function Sidebar() {
  let { url } = useRouteMatch();

  return (
    <>
      <Link
        to={`${url}/create-blog`}
        className="block w-4/5 mx-auto my-4 py-2 px-4 bg-green-300 hover:bg-green-400 mb-4 rounded transition duration-100 font-bold uppercase text-sm text-center"
      >
        Create Blog
      </Link>

      <div className="mt-8">
        <h2 className="text-center text-2xl">Select Blog</h2>
        <div className="h-full mt-8 flex flex-col items-center">
          <Link
            to={`${url}/blog-name-1`}
            className="block w-4/5 py-2 px-4 bg-gray-300 hover:bg-gray-400 mb-4 rounded transition duration-100 text-center"
          >
            #1 BlogName
          </Link>
          <Link
            to={`${url}/blog-name-2`}
            className="block w-4/5 py-2 px-4 bg-gray-300 hover:bg-gray-400 mb-4 rounded transition duration-100 text-center"
          >
            #2 BlogName
          </Link>
          <Link
            to={`${url}/blog-name-3`}
            className="block w-4/5 py-2 px-4 bg-gray-300 hover:bg-gray-400 mb-4 rounded transition duration-100 text-center"
          >
            #3 BlogName
          </Link>
          <Link
            to={`${url}/blog-name-4`}
            className="block w-4/5 py-2 px-4 bg-gray-300 hover:bg-gray-400 mb-4 rounded transition duration-100 text-center"
          >
            #4 BlogName
          </Link>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
