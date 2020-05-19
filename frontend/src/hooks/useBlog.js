import useThunkReducer from './useThunkReducer';
import {
  blogReducer,
  blogsReducer,
  initialBlogState,
  initialBlogsState,
} from 'reducers/blogReducer';

function useBlog() {
  const [state, dispatch] = useThunkReducer(blogReducer, initialBlogState);
  const { blog, loading, error } = state;
  return { blog, loading, error, dispatch };
}

function useBlogs() {
  const [state, dispatch] = useThunkReducer(blogsReducer, initialBlogsState);
  const { blogs, loading, error } = state;
  return { blogs, loading, error, dispatch };
}

export { useBlog, useBlogs };
