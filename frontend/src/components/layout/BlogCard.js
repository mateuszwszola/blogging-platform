import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { UserIcon } from 'icons';
import { API_BASE_URL } from 'api/client';

const BlogCard = ({ blog }) => (
  <div
    key={blog._id}
    className="block w-full md:max-w-md m-2 bg-white rounded shadow overflow-hidden"
  >
    <img
      className="h-56 w-full object-cover object-center"
      src={
        blog.photo
          ? `${API_BASE_URL}/photos/${blog.photo}`
          : 'https://images.unsplash.com/photo-1457282367193-e3b79e38f207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1654&q=80'
      }
      alt=""
    />

    <div className="px-4 py-2">
      <div className="py-2">
        <h3 className="mb-2 text-blue-700 hover:text-blue-800 text-2xl font-medium">
          <Link to={`/blogs/${blog.slug}`}>{blog.name}</Link>
        </h3>
        {blog.description && (
          <p className="text-gray-800">{blog.description}</p>
        )}
      </div>

      <div className="flex items-center mt-5">
        <div className="p-3 bg-gray-300 rounded-full">
          <UserIcon className="h-8 w-8 text-gray-700 fill-current" />
        </div>
        <div className="ml-4">
          <h4 className="text-md font-medium cursor-pointer text-blue-700 hover:text-gray-800">
            {blog.user.name}
          </h4>
          {blog.user.bio && (
            <p className="text-sm text-gray-600">{blog.user.bio}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

BlogCard.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default BlogCard;
