import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import profileImg from '../../img/undraw_profile.svg';

function DisplayPost({ post }) {
  return (
    <div className="px-2 py-4">
      <div>
        <div className="flex flex-col md:flex-row items-center">
          <p className="text-sm sm:text-base text-gray-600 font-semibold tracking-wide">
            <Moment format="YYYY/MM/DD">{post.createdAt}</Moment>
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="py-2 md:py-0 text-center">
              <span className="hidden md:inline-block mx-2">/</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-blue-700 uppercase text-sm md:text-base font-semibold"
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
            src="https://picsum.photos/seed/picsum/1280/720"
            className="max-w-full block mx-auto rounded"
            alt="post-background"
          />
        </div>
        <div className="mt-2 py-4 px-2">
          <p className="text-gray-800 font-normal text-lg md:text-xl lg:text-2xl leading-loose tracking-wide">
            {post.body}
          </p>
        </div>
      </div>
    </div>
  );
}

DisplayPost.propTypes = {
  post: PropTypes.object.isRequired,
};

export default DisplayPost;
