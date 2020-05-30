import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import clsx from 'clsx';
import { CalendarIcon, HeartIcon } from 'icons';

function Posts({ posts }) {
  return (
    <div
      className={clsx(
        'grid grid-cols-1 gap-4 p-2',
        posts.length > 1 && 'lg:grid-cols-2'
      )}
    >
      {posts.length === 0 ? (
        <h2 className="text-center text-2xl">There are no posts</h2>
      ) : (
        posts.map((post) => {
          const bgImgUrl =
            post.bgImgUrl || 'https://picsum.photos/seed/picsum/600/300';

          return (
            <div
              key={post._id}
              className="shadow-lg rounded bg-white block mx-auto w-full max-w-screen-sm"
            >
              <img
                src={bgImgUrl}
                alt=""
                className="h-56 w-full object-cover object-center rounded-t"
              />

              <div className="py-4 px-6">
                <div className="flex items-center my-2">
                  <CalendarIcon className="w-6 h-6 fill-current text-gray-600" />
                  <span className="text-gray-600 ml-2">
                    <Moment format="YYYY/MM/DD">{post.createdAt}</Moment>
                  </span>
                </div>

                <h3 className="mt-2 text-2xl xl:text-3xl uppercase font-semibold cursor-pointer hover:underline text-gray-800">
                  <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                </h3>
                {post.blog && post.blog.name && (
                  <Link
                    to={`/blogs/${post.blog.slug}`}
                    className="text-blue-500 text-xl"
                  >
                    {post.blog.name}
                  </Link>
                )}
                {post.description && <p className="my-2">{post.description}</p>}
                <div className="flex items-center mt-2">
                  <HeartIcon className="w-5 h-5 fill-current text-gray-600" />
                  <span className="text-gray-600 ml-2 select-none">
                    {post.favoritesCount}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default Posts;
