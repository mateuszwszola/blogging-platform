import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { UserCircleIcon, CalendarIcon } from 'icons';
import DisplayDate from 'components/DisplayDate';

function PostCard({ post }) {
  const bgImgUrl =
    (post.bgImg && post.bgImg.image_url) ||
    'https://picsum.photos/seed/picsum/600/300';

  return (
    <div className="shadow-lg rounded-lg bg-white mx-auto w-full max-w-xl">
      <img
        src={bgImgUrl}
        alt=""
        className="h-64 w-full object-cover object-center rounded-t-lg"
      />

      <div className="pt-4 px-8">
        <div className="flex items-center my-2">
          <CalendarIcon className="w-4 h-4 fill-current text-gray-600" />
          <span className="text-gray-600 text-sm ml-2">
            <DisplayDate date={post.createdAt} />
          </span>
        </div>

        <h3 className="text-2xl xl:text-3xl font-semibold cursor-pointer hover:underline text-gray-800">
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.blog && post.blog.name && (
          <Link
            to={`/blogs/${post.blog.slug}`}
            className="block mt-2 text-blue-500 text-lg"
          >
            {post.blog.name}
          </Link>
        )}

        <div className="mt-4 py-6 border-t border-gray-200">
          <Link
            className="no-underline text-gray-600"
            to={`/profile/${post.user._id}`}
          >
            <div className="flex items-center">
              {post.user.avatar?.image_url ? (
                <img
                  className="rounded-full w-10 h-10"
                  src={post.user.avatar.image_url}
                  alt="User avatar"
                />
              ) : (
                <UserCircleIcon className="w-10 h-10 rounded-full fill-current text-gray-600" />
              )}
              <span className="block ml-3 uppercase font-medium">
                {post.user.name}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
};

export default PostCard;
