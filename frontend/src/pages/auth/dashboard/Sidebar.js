import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, useRouteMatch } from 'react-router-dom';
import { Button } from 'components/layout/Button';

function Sidebar({ blogs }) {
  const { url } = useRouteMatch();

  return (
    <div className="relative h-full overflow-hidden py-4 px-2">
      <div className="block w-4/5 max-w-xs mx-auto">
        <Link to={`${url}/create-blog`} className="no-underline">
          <Button size="base" version="primary" fullWidth>
            <span className="uppercase">Create a blog</span>
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-center text-2xl">Select Blog</h2>
        {blogs.length === 0 ? (
          <p className="text-center mt-8">You don't have any blogs yet</p>
        ) : (
          <ul className="mt-8 h-full space-y-4 flex flex-col items-center list-none max-w-xs mx-auto">
            {blogs.map((blog) => (
              <li
                key={`blog-${blog._id}`}
                className="block w-4/5 mx-auto space-y-4"
              >
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
