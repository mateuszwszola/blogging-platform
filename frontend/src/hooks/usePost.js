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

function usePostBySlug(slug) {
  const [status, setStatus] = useState('loading');
  const [post, setPost] = useState(null);

  function reloadPost() {
    setStatus('loading');
  }

  useEffect(() => {
    function getPost() {
      postAPI.getPostBySlug(slug)
        .then(res => {
          setPost(res.post);
          setStatus('loaded');
        })
        .catch(err => {
          console.error(err);
          setStatus('error');
        })
    }
    let canceled = false;

    if (!canceled && status === 'loading' && slug) {
      getPost();
    }

    return () => (canceled = true);
  }, [status, slug]);

  return [post, status, reloadPost];
}

function useUserPosts() {
  const [posts, setPosts] = useState(null);
  const [status, setStatus] = useState('loading');

  function reloadPosts() {
    setStatus('loading');
  }

  useEffect(() => {
    function getPosts() {
      postAPI.getUserPosts()
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

    if (!canceled && status === 'loading') {
      getPosts();
    }

    return () => (canceled = true);
  }, [status]);

  return [posts, status, reloadPosts];
}

export { useBlogPosts, usePostBySlug, useUserPosts };