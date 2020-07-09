import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { CalendarIcon, HeartIcon } from 'icons';

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
            <Moment format="LL">{post.createdAt}</Moment>
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

        {/* <div className="flex items-center mt-2">
          <HeartIcon className="w-5 h-5 fill-current text-gray-600" />
          <span className="text-gray-600 ml-2 select-none">
            {post.favoritesCount}
          </span>
        </div> */}

        <div className="mt-4 py-6 border-t border-gray-200 flex items-center">
          {post.user.avatar?.image_url && (
            <img
              className="rounded-full w-10 h-10"
              src={post.user.avatar.image_url}
              alt="User avatar"
            />
          )}
          <Link
            className="block ml-3 uppercase font-medium text-gray-600 text-base"
            to={`/profile/${post.user._id}`}
          >
            {post.user.name}
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
