import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import PostCard from './layout/PostCard';

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
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default Posts;
