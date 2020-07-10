import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import PostCard from './layout/PostCard';

function Posts({ posts }) {
  return (
    <>
      {posts.length > 0 ? (
        <div
          className={clsx(
            'grid grid-cols-1 row-gap-20 col-gap-12',
            posts.length > 1 && 'lg:grid-cols-2'
          )}
        >
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <h2 className="text-center text-2xl">There are no posts</h2>
      )}
    </>
  );
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default Posts;
