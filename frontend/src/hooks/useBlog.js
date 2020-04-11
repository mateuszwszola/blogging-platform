import { useState, useEffect } from 'react';
import * as blogAPI from 'api/blog';

function useBlogBySlugName(slug) {
  const [status, setStatus] = useState('idle');
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    let canceled = false;

    function getBlog() {
      setStatus('loading');
      blogAPI
        .getBlogBySlugName(slug)
        .then((res) => {
          if (!canceled) {
            setBlog(res.blog);
            setStatus('loaded');
          }
        })
        .catch((err) => {
          if (!canceled) {
            console.error(err);
            setStatus('error');
          }
        });
    }

    if (slug) {
      getBlog();
    }

    return () => (canceled = true);
  }, [slug]);

  return [blog, status];
}

function useAllBlogs() {
  const [status, setStatus] = useState('loading');
  const [blogs, setBlogs] = useState(null);

  function reloadBlogs() {
    setStatus('loading');
  }

  useEffect(() => {
    let canceled = false;

    function getBlogs() {
      blogAPI
        .getAllBlogs()
        .then((res) => {
          if (!canceled) {
            setBlogs(res.blogs);
            setStatus('loaded');
          }
        })
        .catch((err) => {
          if (!canceled) {
            console.error(err);
            setStatus('error');
          }
        });
    }

    if (status === 'loading') {
      getBlogs();
    }

    return () => (canceled = true);
  }, [status]);

  return [blogs, status, reloadBlogs];
}

function useUserBlogs() {
  const [blogs, setBlogs] = useState(null);
  const [status, setStatus] = useState('loading');

  function reloadBlogs() {
    setStatus('loading');
  }

  function addBlog(newBlog) {
    setBlogs([...blogs, newBlog]);
  }

  function removeBlog(blogId) {
    const newBlogs = blogs.filter((blog) => blog._id !== blogId);
    setBlogs(newBlogs);
  }

  useEffect(() => {
    let canceled = false;

    function getBlogs() {
      blogAPI
        .getUserBlogs()
        .then((res) => {
          if (!canceled) {
            setBlogs(res.blogs);
            setStatus('loaded');
          }
        })
        .catch((err) => {
          if (!canceled) {
            console.error(err);
            setStatus('error');
          }
        });
    }

    if (status === 'loading') {
      getBlogs();
    }

    return () => (canceled = true);
  }, [status]);

  return { blogs, status, addBlog, removeBlog, reloadBlogs };
}

export { useBlogBySlugName, useAllBlogs, useUserBlogs };
