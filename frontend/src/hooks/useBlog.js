import { useState, useEffect, useCallback } from 'react';
import * as blogAPI from 'api/blog';
import { blogReducer, blogsReducer } from 'reducers/blogReducer';
import useThunkReducer from './useThunkReducer';
import { fetchBlogBySlug, fetchAllBlogs } from 'actions/blogActions';

const initialBlogState = {
  blog: {},
  loading: true,
  error: null,
};

const initialBlogsState = {
  blogs: [],
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
  const [state, dispatch] = useThunkReducer(blogsReducer, initialBlogsState);

  const getBlogs = useCallback(() => {
    dispatch(() => {
      fetchAllBlogs(dispatch);
    });
  }, [dispatch]);

  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  return [state.blogs, state.loading, state.error, getBlogs];
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
