import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { UserCircleIcon } from 'icons';

const BlogCard = ({ blog }) => {
  const bgImgUrl =
    (blog.bgImg && blog.bgImg.image_url) ||
    'https://images.unsplash.com/photo-1457282367193-e3b79e38f207?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1654&q=80';

  return (
    <div className="shadow-lg rounded-lg bg-white mx-auto w-full max-w-xl">
      <img
        src={bgImgUrl}
        alt=""
        className="h-64 w-full object-cover object-center rounded-t-lg"
      />

      <div className="pt-4 px-8">
        <h3 className="text-2xl xl:text-3xl font-semibold cursor-pointer hover:underline text-gray-800">
          <Link to={`/blogs/${blog.slug}`}>{blog.name}</Link>
        </h3>

        {blog.description && (
          <p className="text-lg py-2 text-gray-700">{blog.description}</p>
        )}

        <div className="mt-4 py-6 border-t border-gray-200">
          <Link
            className="no-underline text-gray-600"
            to={`/profile/${blog.user._id}`}
          >
            <div className="flex items-center">
              {blog.user.avatar?.image_url ? (
                <img
                  className="rounded-full w-10 h-10"
                  src={blog.user.avatar.image_url}
                  alt="User avatar"
                />
              ) : (
                <UserCircleIcon className="w-10 h-10 rounded-full fill-current text-gray-600" />
              )}
              <span className="block ml-3 uppercase font-medium">
                {blog.user.name}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default BlogCard;
