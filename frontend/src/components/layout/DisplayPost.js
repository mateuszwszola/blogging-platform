import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import EditorContentPreview from '../Editor/EditorContentPreview';
import DisplayDate from './DisplayDate';
import { HeartIcon, UserCircleIcon } from 'icons';

function DisplayPost({ post, onLike }) {
  const filteredTags = post.tags && post.tags.filter((t) => t);

  return (
    <div className="px-2 py-4">
      <div>
        <div className="flex flex-col md:flex-row items-center">
          <p className="text-sm sm:text-base text-gray-600 font-semibold tracking-wide">
            <DisplayDate date={post.createdAt} />
          </p>
          {filteredTags.length > 0 && (
            <div className="py-2 md:py-0 text-center">
              <span className="hidden md:inline-block mx-2">/</span>
              {filteredTags.map((tag, index) => (
                <span
                  key={tag}
                  className={`inline-block text-blue-700 uppercase text-sm md:text-base font-semibold${
                    index > 0 ? ' ml-2' : ''
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <h1 className="text-2xl md:text-4xl capitalize text-center md:text-left font-semibold">
          {post.title}
        </h1>

        <div className="flex items-center">
          <button onClick={onLike}>
            <HeartIcon
              className={clsx(
                `w-10 h-10 fill-current`,
                post.favorited
                  ? 'text-red-500 hover:text-red-300'
                  : 'text-red-300 hover:text-red-500'
              )}
            />
          </button>
          <span className="text-2xl ml-2 text-gray-600 font-semibold">
            {post.favoritesCount}
          </span>
        </div>

        <div className="flex flex-col md:flex-row mt-4 items-center">
          {post.user?.avatar?.image_url ? (
            <img
              src={post.user.avatar.image_url}
              alt="profile"
              className="shadow w-16 h-16 rounded-full"
            />
          ) : (
            <UserCircleIcon className="w-16 h-16 rounded-full fill-current text-gray-600" />
          )}
          <Link
            to={`/profile/${post.user._id}`}
            className="block text-base text-gray-700 uppercase font-semibold mt-2 md:mt-0 md:ml-4"
          >
            {post.user.name}
          </Link>
        </div>
      </div>

      <div className="">
        {post.bgImg && post.bgImg.large_image_url && (
          <div className="mt-5">
            <img
              src={post.bgImg.large_image_url}
              className="max-w-full block mx-auto rounded"
              alt="background"
            />
            {post.bgImg.img_attribution && (
              <p className="text-center text-blue-500 mt-2">
                {post.bgImg.img_attribution}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 py-4 px-2 border-t border-solid border-gray-300">
          <div className="text-gray-900 font-normal text-lg md:text-lg lg:text-xl leading-loose tracking-wide">
            <EditorContentPreview body={post.body} />
          </div>
        </div>
      </div>
    </div>
  );
}

DisplayPost.propTypes = {
  post: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired,
};

export default DisplayPost;
