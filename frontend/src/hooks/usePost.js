import useThunkReducer from './useThunkReducer';
import {
  postsReducer,
  postReducer,
  initialPostState,
  initialPostsState,
} from 'reducers/postReducer';

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
