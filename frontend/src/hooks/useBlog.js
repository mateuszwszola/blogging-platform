import {
  useQuery,
  useMutation,
  queryCache,
  useInfiniteQuery,
} from 'react-query';
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
  updateBlog,
  deleteBlog,
  getAllBlogs,
} from 'api/blog';

function useUserBlogs(userId) {
  return useQuery(
    ['blogs', userId],
    () => getUserBlogs(userId).then((res) => res.blogs),
    {
      enabled: userId,
    }
  );
}

function useBlogBySlug(slug) {
  return useQuery(
    ['blog', slug],
    () => getBlogBySlugName(slug).then((res) => res.blog),
    {
      enabled: slug,
    }
  );
}

function useAllBlogs() {
  return useInfiniteQuery('blogs', getAllBlogs, {
    getFetchMore: (lastGroup, allGroups) => lastGroup.nextCursor,
  });
}

function useCreateBlog() {
  return useMutation((values) => createBlog(values).then((res) => res.blog), {
    onSuccess: () => queryCache.invalidateQueries('blogs'),
  });
}

function useUpdateBlog() {
  return useMutation(
    (data) => updateBlog(data.blogId, data.formData).then((res) => res.blog),
    {
      onSuccess: (updatedBlog) => {
        const oldBlogData =
          queryCache.getQueryData(['blog', updatedBlog.slug]) || {};
        const { user, ...newBlogData } = updatedBlog;
        queryCache.setQueryData(['blog', updatedBlog.slug], {
          ...oldBlogData,
          ...newBlogData,
        });
        queryCache.invalidateQueries('blogs');
      },
    }
  );
}

function useDeleteBlog() {
  return useMutation((blogId) => deleteBlog(blogId), {
    onSuccess: (deletedBlog) => {
      queryCache.invalidateQueries('blogs');
      queryCache.removeQueries(['blog', deletedBlog.slug]);
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
  useUpdateBlog,
  useDeleteBlog,
  useBlog,
  useBlogs,
};
