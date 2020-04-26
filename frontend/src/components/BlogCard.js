import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import profileImg from 'img/undraw_profile.svg';

const BlogCard = (blog) => (
  <div
    key={blog._id}
    className="w-full max-w-xs m-2 bg-gray-200 shadow py-4 px-2 rounded flex flex-col justify-between"
  >
    <div className="flex flex-col items-center text-center">
      <h3 className="text-blue-700 hover:text-gray-800 text-2xl font-medium">
        <Link to={`/blogs/${blog.slug}`}>{blog.name}</Link>
      </h3>
      {blog.description && <p className="text-gray-800">{blog.description}</p>}
    </div>

    <div className="flex items-center mt-5">
      <img src={profileImg} alt="profile" className="w-16 h-16 rounded-full" />
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
);

BlogCard.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default BlogCard;
