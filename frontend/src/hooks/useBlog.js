import { useQuery, useMutation, queryCache } from 'react-query';
import useThunkReducer from './useThunkReducer';
import {
  blogReducer,
  blogsReducer,
  initialBlogState,
  initialBlogsState,
} from 'reducers/blogReducer';
import {
  getUserBlogs,
  getBlogBySlugName,
  createBlog,
  deleteBlog,
  getAllBlogs,
} from 'api/blog';

function useUserBlogs(userId) {
  return useQuery(userId && ['blogs', userId], () =>
    getUserBlogs(userId).then((res) => res.blogs)
  );
}

function useBlogBySlug(slug) {
  return useQuery(slug && ['blog', slug], () =>
    getBlogBySlugName(slug).then((res) => res.blog)
  );
}

function useAllBlogs() {
  return useQuery('blogs', () => getAllBlogs().then((res) => res.blogs));
}

function useCreateBlog() {
  return useMutation((values) => createBlog(values).then((res) => res.blog), {
    onSuccess: () => queryCache.refetchQueries('blogs'),
  });
}

function useDeleteBlog() {
  return useMutation((blogId) => deleteBlog(blogId), {
    onSuccess: () => {
      queryCache.refetchQueries('blogs');
    },
  });
}

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

export {
  useUserBlogs,
  useBlogBySlug,
  useAllBlogs,
  useCreateBlog,
  useDeleteBlog,
  useBlog,
  useBlogs,
};
