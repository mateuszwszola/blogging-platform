import { useState, useEffect } from 'react';
import * as postAPI from '../api/post';

function useBlogPosts(blogId) {
  const [status, setStatus] = useState('loading');
  const [posts, setPosts] = useState(null);

  function reloadPosts() {
    setStatus('loading');
  }

  useEffect(() => {
    function getPosts() {
      postAPI.getBlogPosts(blogId)
        .then(res => {
          setPosts(res.posts);
          setStatus('loaded');
        })
        .catch(err => {
          console.error(err);
          setStatus('error');
        })
    }
    let canceled = false;

    if (!canceled && status === 'loading' && blogId) {
      getPosts();
    }

    return () => (canceled = true);
  }, [status, blogId]);

  return [posts, status, reloadPosts];
}

export { useBlogPosts };