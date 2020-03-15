import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../../api/api';
import Posts from '../../Posts';

function Homepage({ posts, loading, ...props }) {
  return (
    <div className="md:pt-16 pb-16 max-w-screen-xl mx-auto mt-6">
      <h1 className="text-3xl text-center leading-loose my-4">
        Your Blog posts
      </h1>
      {loading ? <div>Loading...</div> : <Posts posts={posts} />}
    </div>
  );
}

Homepage.propTypes = {
  posts: PropTypes.array,
  loading: PropTypes.bool.isRequired
};

function HomepageContainer(props) {
  const [posts, setPosts] = useState(null);
  const [status, setStatus] = useState('loading');

  function getUserPosts() {
    api('posts')
      .then(res => {
        setPosts(res.posts);
        setStatus('loaded');
      })
      .catch(err => {
        console.error(err);
        setStatus('error');
      });
  }

  useEffect(() => {
    let canceled = false;
    if (!canceled && status === 'loading') {
      getUserPosts();
    }
    return () => (canceled = true);
  }, [status]);

  if (status === 'error') {
    return <div>There is a problem with the server. Try reload the page</div>;
  }

  return <Homepage posts={posts} loading={status === 'loading'} />;
}

export default HomepageContainer;
