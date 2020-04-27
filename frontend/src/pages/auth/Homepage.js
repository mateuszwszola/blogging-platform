import React from 'react';
import { useUserPosts } from 'hooks/usePost';
import Posts from 'components/Posts';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';

function Homepage() {
  const [posts, loading, error] = useUserPosts();

  return (
    <div className="md:pt-16 pb-16 max-w-screen-xl mx-auto mt-6">
      <h1 className="text-3xl text-center leading-loose my-4">
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
