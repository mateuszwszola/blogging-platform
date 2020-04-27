import { useEffect, useCallback } from 'react';
import { blogReducer, blogsReducer } from 'reducers/blogReducer';
import useThunkReducer from './useThunkReducer';
import {
  fetchBlogBySlug,
  fetchAllBlogs,
  fetchUserBlogs,
  setBlogAction,
  removeBlogAction,
} from 'actions/blogActions';

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
  const [state, dispatch] = useThunkReducer(blogsReducer, initialBlogsState);

  const getBlogs = useCallback(() => {
    dispatch(() => {
      fetchUserBlogs(dispatch);
    });
  }, [dispatch]);

  const setBlog = useCallback(
    (blog) => {
      dispatch(setBlogAction(blog));
    },
    [dispatch]
  );

  const removeBlog = useCallback(
    (blogId) => {
      dispatch(removeBlogAction(blogId));
    },
    [dispatch]
  );

  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  return {
    ...state,
    getBlogs,
    setBlog,
    removeBlog,
  };
}

export { useBlogBySlugName, useAllBlogs, useUserBlogs };
