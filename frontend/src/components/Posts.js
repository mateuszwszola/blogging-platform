import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import clsx from 'clsx';
import { CalendarIcon, StarFullIcon } from 'icons';

function Posts({ posts }) {
  return (
    <div
      className={clsx(
        'grid grid-cols-1 gap-4 p-2',
        posts.length > 1 && 'lg:grid-cols-2'
      )}
    >
      {posts.length === 0 ? (
        <h2 className="text-center text-2xl uppercase font-semibold">
          No Blog Posts
        </h2>
      ) : (
        posts.map((post) => {
          const bgImgUrl =
            post.bgImgUrl || 'https://picsum.photos/seed/picsum/600/300';

          return (
            <div key={post._id} className="block mx-auto max-w-screen-sm">
              <img
                src={bgImgUrl}
                alt=""
                className="max-w-full rounded mx-auto"
              />
              <div className="px-4">
                <div className="flex items-center my-2">
                  <CalendarIcon className="w-6 h-6 fill-current text-gray-600" />
                  <span className="text-gray-600 ml-2">
                    <Moment format="YYYY/MM/DD">{post.createdAt}</Moment>
                  </span>
                </div>

                <h3 className="mt-2 text-2xl xl:text-3xl uppercase font-semibold cursor-pointer hover:underline text-gray-800">
                  <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="ml-2 text-gray-700 font-light text-xl">
                  #{post.blog.name}
                </p>
                {post.description && <p className="my-2">{post.description}</p>}
                <div className="flex items-center my-2">
                  <StarFullIcon className="w-6 h-6 fill-current text-green-900 cursor-pointer" />
                  <span className="text-gray-600 ml-2 select-none">
                    {Math.floor(Math.random() * 100)}
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
