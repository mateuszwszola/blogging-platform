import { useQuery, useMutation, queryCache } from 'react-query';
import useThunkReducer from './useThunkReducer';
import {
  blogReducer,
  blogsReducer,
  initialBlogState,
  initialBlogsState,
} from 'reducers/blogReducer';
import { getUserBlogs, getBlogBySlugName, createBlog } from 'api/blog';

export function useUserBlogs() {
  return useQuery('userBlogs', () => getUserBlogs().then((res) => res.blogs));
}

export function useBlogBySlug(slug) {
  return useQuery(slug && ['blog', slug], () =>
    getBlogBySlugName(slug).then((res) => res.blog)
  );
}

export function useCreateBlog() {
  return useMutation((values) => createBlog(values).then((res) => res.blog), {
    onMutate: (values) => {
      const previousBlogs = queryCache.getQueryData('userBlogs');

      queryCache.setQueryData('userBlogs', (old) => [
        ...old,
        {
          _id: 'temp',
          ...values,
        },
      ]);

      return () => queryCache.setQueryData('userBlogs', previousBlogs);
    },
    onError: (error, values, rollback) => rollback(),
    onSuccess: () => queryCache.refetchQueries('userBlogs'),
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

export { useBlog, useBlogs };
