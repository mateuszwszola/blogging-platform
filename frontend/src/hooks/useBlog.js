import { useState, useEffect } from 'react';
import * as blogAPI from 'api/blog';
import { blogReducer } from 'reducers/blogReducer';
import useThunkReducer from './useThunkReducer';
import { fetchBlogBySlug } from 'actions/blogActions';

const initialBlogState = {
  blog: {},
  loading: true,
  error: null,
};

function useBlogBySlugName(slug) {
  const [state, dispatch] = useThunkReducer(blogReducer, initialBlogState);

  useEffect(() => {
    if (!slug) return;

    dispatch(() => {
      fetchBlogBySlug(dispatch, slug);
    });
  }, [dispatch, slug]);

  return [state.blog, state.loading, state.error];
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
