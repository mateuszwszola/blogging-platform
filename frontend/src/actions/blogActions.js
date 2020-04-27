import {
  LOADING,
  RESPONSE_COMPLETE,
  ERROR,
  SET_BLOG,
  REMOVE_BLOG,
} from './types';
import * as blogAPI from 'api/blog';

export const fetchBlogBySlug = (dispatch, slug) => {
  dispatch({ type: LOADING });

  blogAPI
    .getBlogBySlugName(slug)
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { blog: response.blog } });
    })
    .catch((error) => {
      dispatch({ type: ERROR, payload: { error } });
    });
};

export const fetchAllBlogs = (dispatch) => {
  dispatch({ type: LOADING });

  blogAPI
    .getAllBlogs()
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { blogs: response.blogs } });
    })
    .catch((error) => {
      dispatch({ type: ERROR, payload: { error } });
    });
};

export const fetchUserBlogs = (dispatch) => {
  dispatch({ type: LOADING });

  blogAPI
    .getUserBlogs()
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { blogs: response.blogs } });
    })
    .catch((error) => {
      dispatch({ type: ERROR, payload: { error } });
    });
};

export const createBlog = (dispatch, data) => {
  dispatch({ type: LOADING });

  blogAPI
    .createBlog(data)
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { blog: response.blog } });
    })
    .catch((error) => {
      dispatch({ type: ERROR, payload: { error } });
    });
};

export const deleteBlog = (dispatch, blogId) => {
  dispatch({ type: LOADING });

  blogAPI
    .deleteBlog(blogId)
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { blog: response.blog } });
    })
    .catch((error) => {
      dispatch({ type: ERROR, payload: { error } });
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
