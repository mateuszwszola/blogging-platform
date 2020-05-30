import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import profileImg from 'img/undraw_profile.svg';
import EditorContentPreview from '../Editor/EditorContentPreview';
import DisplayDate from './DisplayDate';
import { HeartIcon } from 'icons';

function DisplayPost({ post, onLike, favorited }) {
  const userAvatar =
    (post.user && post.user.avatar && post.user.avatar.photoURL) || null;

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
                favorited ? 'text-red-500' : 'text-red-300'
              )}
            />
          </button>
          <span className="text-2xl ml-2 text-gray-600">
            {post.favoritesCount}
          </span>
        </div>

        <div className="flex flex-col md:flex-row mt-4 items-center">
          <img
            src={userAvatar || profileImg}
            alt="profile"
            className="shadow w-16 rounded-full"
          />
          <h3 className="text-base text-gray-700 uppercase font-semibold mt-2 md:mt-0 md:ml-4">
            {post.user.name}
          </h3>
        </div>
      </div>

      <div className="">
        {post.bgImgUrl && (
          <div className="mt-5">
            <img
              src={post.bgImgUrl}
              className="max-w-full block mx-auto rounded"
              alt="post-background"
            />
            {post.imgAttribution && (
              <p className="text-center text-blue-500 mt-2">
                {post.imgAttribution}
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
  favorited: PropTypes.bool.isRequired,
};

export default DisplayPost;
