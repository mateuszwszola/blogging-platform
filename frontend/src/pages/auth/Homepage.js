import React from 'react';
import { useUserPosts } from 'hooks/usePost';
import Posts from 'components/Posts';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import { useUser } from 'context/UserContext';

function Homepage() {
  const { user } = useUser();
  const { status, data: posts, error } = useUserPosts(user._id);

  return (
    <div className="py-16 max-w-screen-xl mx-auto">
      <h1 className="text-3xl text-center leading-loose my-8">
        Your Blog posts
      </h1>
      {error ? (
        <DisplayError msg={error.msg} />
      ) : status === 'loading' ? (
        <Loading />
      ) : (
        <Posts posts={posts} />
      )}
    </div>
  );
}

export default Homepage;
