import { useQuery, useMutation, queryCache } from 'react-query';
import useThunkReducer from './useThunkReducer';
import {
  postsReducer,
  postReducer,
  initialPostState,
  initialPostsState,
} from 'reducers/postReducer';
import {
  getUserPosts,
  getBlogPosts,
  getPostBySlug,
  deletePost,
  addBlogPost,
  updatePost,
  favoritePost,
  unfavoritePost,
} from 'api/post';

function useUserPosts(userId) {
  return useQuery(userId && ['posts', userId], () =>
    getUserPosts(userId).then((res) => res.posts)
  );
}

function useBlogPosts(blogId) {
  return useQuery(blogId && ['posts', blogId], () =>
    getBlogPosts(blogId).then((res) => res.posts)
  );
}

function usePostBySlug(slug) {
  // return useQuery(slug && ['post', slug], () =>
  //   getPostBySlug(slug).then((res) => res.post)
  // );
  return useQuery({
    queryKey: slug && ['post', slug],
    queryFn: () => getPostBySlug(slug).then((res) => res.post),
    config: {
      staleTime: 10000,
    },
  });
}

function useCreatePost() {
  return useMutation(({ blogId, values }) =>
    addBlogPost(blogId, values).then((res) => res.post)
  );
}

function useUpdatePost() {
  return useMutation(
    (data) => updatePost(data.postId, data.values).then((res) => res.post),
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
  return useMutation((postId) => deletePost(postId));
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
    onError: (err, slug, rollback) => rollback(),
    onSeattled: (slug) => {
      queryCache.refetchQueries(['post', slug]);
    },
    // onSuccess: (data, slug) => {
    //   queryCache.setQueryData(['post', slug], (post) => ({
    //     ...post,
    //     favoritesCount: data.post.favoritesCount,
    //     favorited: data.post.favorited,
    //   }));
    // },
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
    onError: (err, slug, rollback) => rollback(),
    onSeattled: (slug) => {
      queryCache.refetchQueries(['post', slug]);
    },
    // onSuccess: (data, slug) => {
    //   queryCache.setQueryData(['post', slug], (post) => ({
    //     ...post,
    //     favoritesCount: data.post.favoritesCount,
    //     favorited: data.post.favorited,
    //   }));
    // },
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
};
