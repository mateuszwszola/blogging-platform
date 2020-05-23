import { RESPONSE_COMPLETE } from './types';
import { SET_BLOG, REMOVE_BLOG } from 'reducers/blogReducer';
import * as blogAPI from 'api/blog';
import { setLoading, setError } from './actionsCreators';

export const fetchBlogBySlug = (slug) => (dispatch) => {
  dispatch(setLoading());

  blogAPI
    .getBlogBySlugName(slug)
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { blog: response.blog } });
    })
    .catch((error) => {
      dispatch(setError(error));
    });
};

export const fetchAllBlogs = () => (dispatch) => {
  dispatch(setLoading());

  blogAPI
    .getAllBlogs()
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { blogs: response.blogs } });
    })
    .catch((error) => {
      dispatch(setError(error));
    });
};

export const fetchUserBlogs = () => (dispatch) => {
  dispatch(setLoading());

  blogAPI
    .getUserBlogs()
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { blogs: response.blogs } });
    })
    .catch((error) => {
      dispatch(setError(error));
    });
};

export const createBlog = (data) => (dispatch) => {
  dispatch(setLoading());

  blogAPI
    .createBlog(data)
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { blog: response.blog } });
    })
    .catch((error) => {
      dispatch(setError(error));
    });
};

export const deleteBlog = (blogId) => (dispatch) => {
  dispatch(setLoading());

  blogAPI
    .deleteBlog(blogId)
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { blog: response.blog } });
    })
    .catch((error) => {
      dispatch(setError(error));
    });
};

export const setBlogAction = (blog) => ({
  type: SET_BLOG,
  payload: { blog },
});

export const removeBlogAction = (blogId) => ({
  type: REMOVE_BLOG,
  payload: { blogId },
});
