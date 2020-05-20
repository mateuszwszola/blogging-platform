import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, useRouteMatch } from 'react-router-dom';

function Sidebar({ blogs }) {
  let { url } = useRouteMatch();

  return (
    <div className="relative h-full overflow-hidden py-4 px-2">
      <Link
        to={`${url}/create-blog`}
        className="shadow-xs block w-4/5 max-w-xs mx-auto py-2 px-4 bg-green-300 hover:bg-green-400 mb-4 rounded transition duration-100 font-bold uppercase text-sm text-center"
      >
        Create Blog
      </Link>

      <div className="mt-8">
        <h2 className="text-center text-2xl">Select Blog</h2>
        {blogs.length === 0 ? (
          <p className="text-center mt-8">There is no blogs</p>
        ) : (
          <ul className="mt-8 h-full space-y-4 flex flex-col items-center list-none">
            {blogs.map((blog) => (
              <li key={`blog-${blog._id}`} className="block w-full max-w-xs">
                <NavLink
                  to={`${url}/${blog.slug}`}
                  className="shadow-xs block py-2 px-4 bg-gray-300 hover:bg-gray-400 mb-4 rounded text-center"
                  activeClassName="bg-gray-400"
                >
                  {blog.name}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  blogs: PropTypes.array,
};

export default Sidebar;
