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
} from 'api/post';

export function useUserPosts() {
  return useQuery('userPosts', () => getUserPosts().then((res) => res.posts));
}

export function useBlogPosts(blogId) {
  return useQuery(blogId && ['posts', blogId], () =>
    getBlogPosts(blogId).then((res) => res.posts)
  );
}

export function usePostBySlug(slug) {
  return useQuery(slug && ['post', slug], () =>
    getPostBySlug(slug).then((res) => res.post)
  );
}

export function useCreatePost() {
  return useMutation(({ blogId, values }) =>
    addBlogPost(blogId, values).then((res) => res.post)
  );
}

export function useDeletePost() {
  return useMutation((postId) => deletePost(postId), {
    onMutate: (postId) => {
      const previousPosts = queryCache.getQueryData('posts');

      queryCache.setQueryData('posts', (old) =>
        old.filter((p) => p._id !== postId)
      );

      return () => queryCache.setQueryData('posts', previousPosts);
    },
    onError: (error, postId, rollback) => rollback(),
    onSuccess: () => queryCache.refetchQueries('posts'),
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

export { usePosts, usePost };
