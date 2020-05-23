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
} from 'api/post';

function useUserPosts() {
  return useQuery('posts', () => getUserPosts().then((res) => res.posts));
}

function useBlogPosts(blogId) {
  return useQuery(blogId && ['posts', blogId], () =>
    getBlogPosts(blogId).then((res) => res.posts)
  );
}

function usePostBySlug(slug) {
  return useQuery(slug && ['post', slug], () =>
    getPostBySlug(slug).then((res) => res.post)
  );
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
};
