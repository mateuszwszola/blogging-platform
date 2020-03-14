import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, useRouteMatch } from 'react-router-dom';

function Sidebar({ blogs, loading, ...props }) {
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
        {loading || blogs === null ? (
          <div>Loading...</div>
        ) : (
          <ul className="h-full mt-8 flex flex-col items-center list-none">
            {blogs.map(blog => (
              <li key={blog.slug} className="block w-4/5 mx-auto">
                <NavLink
                  to={`${url}/${blog.slug}`}
                  className="block py-2 px-4 bg-gray-300 hover:bg-gray-400 mb-4 rounded transition duration-100 text-center"
                  activeClassName="bg-gray-400"
                >
                  {blog.name}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

Sidebar.propTypes = {
  blogs: PropTypes.array,
  loading: PropTypes.bool.isRequired
};

export default Sidebar;