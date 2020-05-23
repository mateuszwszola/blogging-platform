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

function useUserBlogs() {
  return useQuery(['blogs', 'user'], () =>
    getUserBlogs().then((res) => res.blogs)
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
    onMutate: (values) => {
      const previousBlogs = queryCache.getQueryData(['blogs', 'user']);

      queryCache.setQueryData(['blogs', 'user'], (old) => [
        ...old,
        {
          _id: 'temp',
          ...values,
        },
      ]);

      return () => queryCache.setQueryData(['blogs', 'user'], previousBlogs);
    },
    onError: (error, values, rollback) => rollback(),
    onSuccess: () => queryCache.refetchQueries(['blogs', 'user']),
  });
}

function useDeleteBlog(key = ['blogs', 'user']) {
  return useMutation((blogId) => deleteBlog(blogId), {
    onMutate: (blogId) => {
      const previousBlogs = queryCache.getQueryData(key);

      queryCache.setQueryData(key, (old) =>
        old.filter((b) => b._id !== blogId)
      );

      return () => queryCache.setQueryData(key, previousBlogs);
    },
    onError: (error, blogId, rollback) => rollback(),
    onSuccess: () => {
      queryCache.refetchQueries(key);
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
