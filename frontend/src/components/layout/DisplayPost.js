import React from 'react';
import PropTypes from 'prop-types';
import profileImg from 'img/undraw_profile.svg';
import EditorContentPreview from '../Editor/EditorContentPreview';
import DisplayDate from './DisplayDate';

function DisplayPost({ post }) {
  return (
    <div className="px-2 py-4">
      <div>
        <div className="flex flex-col md:flex-row items-center">
          <p className="text-sm sm:text-base text-gray-600 font-semibold tracking-wide">
            <DisplayDate date={post.createdAt} />
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="py-2 md:py-0 text-center">
              <span className="hidden md:inline-block mx-2">/</span>
              {post.tags.map((tag, index) => (
                <span
                  key={tag}
                  className={`text-blue-700 uppercase text-sm md:text-base font-semibold${
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
        <div className="flex flex-col md:flex-row mt-2 items-center">
          <img src={profileImg} alt="profile" className="w-16" />
          <h3 className="text-base text-gray-700 uppercase font-semibold mt-2 md:ml-4">
            {post.user.name}
          </h3>
        </div>
      </div>

      <div className="mt-3">
        <div className="">
          <img
            src={
              post.bgImg
                ? post.bgImg
                : 'https://picsum.photos/seed/picsum/1280/720'
            }
            className="max-w-full block mx-auto rounded"
            alt="post-background"
          />
          {post.imgAttribution && (
            <p className="text-center text-blue-500 mt-2">
              {post.imgAttribution}
            </p>
          )}
        </div>
        <div className="mt-2 py-4 px-2">
          <div className="text-gray-800 font-normal text-lg md:text-xl lg:text-2xl leading-loose tracking-wide">
            <EditorContentPreview body={post.body} />
          </div>
        </div>
      </div>
    </div>
  );
}

DisplayPost.propTypes = {
  post: PropTypes.object.isRequired,
};

export default DisplayPost;
