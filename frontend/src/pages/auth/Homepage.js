import React, { useEffect } from 'react';
import { usePosts } from 'hooks/usePost';
import Posts from 'components/Posts';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import { fetchUserPosts } from 'actions/postActions';

function Homepage() {
  const { posts, loading, error, dispatch } = usePosts();

  useEffect(() => {
    dispatch(fetchUserPosts());
  }, [dispatch]);

  return (
    <div className="py-16">
      <h1 className="text-3xl text-center leading-loose my-8">
        Your Blog posts
      </h1>
      {error ? (
        <DisplayError />
      ) : loading ? (
        <Loading />
      ) : (
        <Posts posts={posts} />
      )}
    </div>
  );
}

export default Homepage;
