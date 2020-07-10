import {
  useQuery,
  useMutation,
  queryCache,
  useInfiniteQuery,
} from 'react-query';
import useThunkReducer from './useThunkReducer';
import {
  postsReducer,
  postReducer,
  initialPostState,
  initialPostsState,
} from 'reducers/postReducer';
import {
  getHomepagePosts,
  getUserPosts,
  getBlogPosts,
  getPostBySlug,
  deletePost,
  addBlogPost,
  updatePost,
  favoritePost,
  unfavoritePost,
  getUserFavorites,
} from 'api/post';

function useHomepagePosts() {
  return useInfiniteQuery(
    'posts',
    (key, nextCursor) => getHomepagePosts(nextCursor),
    {
      getFetchMore: (lastGroup, allGroups) => lastGroup.nextCursor,
    }
  );
}

function useUserPosts(userId) {
  return useInfiniteQuery(
    ['posts', userId],
    (key, userId, nextCursor) => getUserPosts(userId, nextCursor),
    {
      getFetchMore: (lastGroup, allGroups) => lastGroup.nextCursor,
    },
    {
      enabled: userId,
    }
  );
}

function useUserFavoritePosts(userId) {
  return useInfiniteQuery(
    ['posts', userId, { type: 'favorite' }],
    (key, userId, type, nextCursor) => getUserFavorites(userId, nextCursor),
    {
      getFetchMore: (lastGroup, allGroups) => lastGroup.nextCursor,
    },
    {
      enabled: userId,
    }
  );
}

function useBlogPosts(blogId) {
  return useQuery(
    ['posts', blogId],
    () => getBlogPosts(blogId).then((res) => res.posts),
    {
      enabled: blogId,
    }
  );
}

function usePostBySlug(slug) {
  return useQuery(
    ['post', slug],
    () => getPostBySlug(slug).then((res) => res.post),
    {
      enabled: slug,
    }
  );
}

function useCreatePost() {
  return useMutation(
    (data) => addBlogPost(data.blogId, data.values).then((res) => res.post),
    {
      onSuccess: () => queryCache.invalidateQueries('posts'),
    }
  );
}

function useUpdatePost() {
  return useMutation(
    (data) => updatePost(data.postId, data.formData).then((res) => res.post),
    {
      onSuccess: (updatedPost) => {
        queryCache.setQueryData(['post', updatedPost.slug], (old) => {
          const { user, blog, ...newPostContent } = updatedPost;
          return {
            ...old,
            ...newPostContent,
          };
        });
      },
    }
  );
}

function useDeletePost() {
  return useMutation((postId) => deletePost(postId), {
    onSuccess: (deletedPost) => {
      queryCache.removeQueries(['post', deletedPost.slug]);
      queryCache.invalidateQueries('posts');
    },
  });
}

function useFavoritePost() {
  return useMutation((slug) => favoritePost(slug), {
    onMutate: (slug) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      queryCache.cancelQueries(['post', slug]);
      // Snapshot the previous value
      const previousPost = queryCache.getQueryData(['post', slug]);
      // Optimistically update to the new value
      queryCache.setQueryData(['post', slug], (post) => ({
        ...post,
        favoritesCount: post.favoritesCount + 1,
        favorited: true,
      }));
      // Return a rollback function
      return () => queryCache.setQueryData(['post', slug], previousPost);
    },
    onSettled: (slug, error, variables, rollback) => {
      if (error) {
        rollback();
      }
    },
  });
}

function useUnfavoritePost() {
  return useMutation((slug) => unfavoritePost(slug), {
    onMutate: (slug) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      queryCache.cancelQueries(['post', slug]);
      // Snapshot the previous value
      const previousPost = queryCache.getQueryData(['post', slug]);
      // Optimistically update to the new value
      queryCache.setQueryData(['post', slug], (post) => ({
        ...post,
        favoritesCount: Math.max(0, post.favoritesCount - 1),
        favorited: false,
      }));
      // Return a rollback function
      return () => queryCache.setQueryData(['post', slug], previousPost);
    },
    onSettled: (slug, error, variables, rollback) => {
      if (error) {
        rollback();
      }
    },
  });
}

function usePost() {
  const [state, dispatch] = useThunkReducer(postReducer, initialPostState);
  const { post, loading, error } = state;
  return { post, loading, error, dispatch };
}

function usePosts() {
  const [state, dispatch] = useThunkReducer(postsReducer, initialPostsState);
  const { posts, loading, error } = state;
  return { posts, loading, error, dispatch };
}

export {
  useHomepagePosts,
  useUserPosts,
  useBlogPosts,
  usePostBySlug,
  useCreatePost,
  useUpdatePost,
  usePosts,
  useDeletePost,
  usePost,
  useFavoritePost,
  useUnfavoritePost,
  useUserFavoritePosts,
};
