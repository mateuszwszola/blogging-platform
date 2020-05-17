import React from 'react';
import { useUserPosts } from 'hooks/usePost';
import Posts from 'components/Posts';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';

function Homepage() {
  const [posts, loading, error] = useUserPosts();

  return (
    <div className="py-16">
      <h1 className="font-serif text-3xl text-center leading-loose my-8">
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
