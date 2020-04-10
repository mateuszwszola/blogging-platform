import React from 'react';
import PropTypes from 'prop-types';
import { useUserPosts } from 'hooks/usePost';
import Posts from 'components/Posts';
import Loading from 'components/Loading';

function Homepage({ posts, loading, ...props }) {
  return (
    <div className="md:pt-16 pb-16 max-w-screen-xl mx-auto mt-6">
      <h1 className="text-3xl text-center leading-loose my-4">
        Your Blog posts
      </h1>
      {loading ? <Loading /> : <Posts posts={posts} />}
    </div>
  );
}

Homepage.propTypes = {
  posts: PropTypes.array,
  loading: PropTypes.bool.isRequired,
};

function HomepageContainer(props) {
  const [posts, status] = useUserPosts();

  if (status === 'error') {
    return (
      <div className="mt-16">
        There is a problem with the server. Try reload the page
      </div>
    );
  }

  return <Homepage posts={posts} loading={status === 'loading'} />;
}

export default HomepageContainer;
