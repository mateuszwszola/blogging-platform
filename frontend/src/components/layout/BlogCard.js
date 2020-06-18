import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { UserIcon } from 'icons';

const BlogCard = ({ blog }) => {
  const blogBgImg =
    (blog.bgImg && blog.bgImg.photoURL) ||
    'https://images.unsplash.com/photo-1457282367193-e3b79e38f207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1654&q=80';

  const userAvatar =
    (blog.user && blog.user.avatar && blog.user.avatar.photoURL) || null;

  return (
    <div className="w-full max-w-screen-sm bg-white rounded shadow-lg overflow-hidden mx-auto">
      <div key={blog._id} className="flex flex-col">
        <img
          className="h-56 w-full object-cover object-center"
          src={blogBgImg}
          alt=""
        />

        <div className="py-2 pb-4 px-4 h-full flex flex-col justify-between">
          <div className="py-2">
            <h3 className="mb-2 text-blue-700 hover:text-blue-800 text-2xl font-medium">
              <Link to={`/blogs/${blog.slug}`}>{blog.name}</Link>
            </h3>
            {blog.description && (
              <p className="text-gray-800">{blog.description}</p>
            )}
          </div>

          <div className="flex items-center mt-5">
            {userAvatar ? (
              <img
                className="shadow w-12 h-12 rounded-full"
                src={userAvatar}
                alt=""
              />
            ) : (
              <div className="shadow p-3 bg-gray-300 rounded-full">
                <UserIcon className="h-8 w-8 text-gray-700 fill-current" />
              </div>
            )}
            <div className="ml-4">
              <h4 className="text-md font-medium text-blue-700 hover:text-blue-800">
                <Link to={`/profile/${blog.user._id}`}>{blog.user.name}</Link>
              </h4>
              {blog.user.bio && (
                <p className="text-sm text-gray-600">{blog.user.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default BlogCard;
