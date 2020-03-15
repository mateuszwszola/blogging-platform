import { useState, useEffect } from 'react';
import * as blogAPI from '../api/blog';

function useBlogBySlugName(slug) {
  const [status, setStatus] = useState('loading');
  const [blog, setBlog] = useState(null);

  function reloadBlog() {
    setStatus('loading');
  }
  
  useEffect(() => {
    let canceled = false;

    function getBlog() {
      blogAPI.getBlogBySlugName(slug)
        .then(res => {
          setBlog(res.blog);
          setStatus('loaded');
        })
        .catch(err => {
          console.error(err);
          setStatus('error');
        })
    }

    if (!canceled && slug) {
      getBlog();
    }

    return () => canceled = true;
  }, [status, slug]);

  return [blog, status, reloadBlog];
}

function useAllBlogs() {
  const [status, setStatus] = useState('loading');
  const [blogs, setBlogs] = useState(null);

  function reloadBlogs() {
    setStatus('loading');
  }
  
  useEffect(() => {
    function getBlogs() {
      blogAPI.getAllBlogs()
        .then(res => {
          setBlogs(res.blogs);
          setStatus('loaded');
        })
        .catch(err => {
          console.error(err);
          setStatus('error');
        })
    }

    let canceled = false;

    if (!canceled && status === 'loading') {
      getBlogs();
    }

    return () => canceled = true;
  }, [status]);

  return [blogs, status, reloadBlogs];
}

function useUserBlogs() {
  const [blogs, setBlogs] = useState(null);
  const [status, setStatus] = useState('loading');

  function reloadBlogs() {
    setStatus('loading');
  }
  
  useEffect(() => {
    function getBlogs() {
      blogAPI.getUserBlogs()
        .then(res => {
          setBlogs(res.blogs);
          setStatus('loaded');
        })
        .catch(err => {
          console.error(err);
          setStatus('error');
        })
    }

    let canceled = false;

    if (!canceled && status === 'loading') {
      getBlogs();
    }

    return () => canceled = true;
  }, [status]);

  return [blogs, status, reloadBlogs];
}

export { useBlogBySlugName, useAllBlogs, useUserBlogs };