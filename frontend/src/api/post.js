import client from './client';

function getHomepagePosts(key, cursor = 0) {
  return client(`posts/all?cursor=${cursor}`);
}

function getBlogPosts(blogId) {
  return client(`posts/blog/${blogId}`);
}

function getPostBySlug(slug) {
  return client(`posts/slug/${slug}`);
}

function getUserPosts(userId) {
  return client(`posts/user/${userId}`);
}

function addBlogPost(blogId, data) {
  return client(`posts/${blogId}`, data);
}

function updatePost(postId, data) {
  return client(`posts/${postId}`, { formData: data, method: 'PUT' });
}

function deletePost(postId) {
  return client(`posts/${postId}`, { method: 'DELETE' });
}

function favoritePost(slug) {
  return client(`posts/${slug}/favorite`, { method: 'POST' });
}

function unfavoritePost(slug) {
  return client(`posts/${slug}/favorite`, { method: 'DELETE' });
}

function getUserFavorites(userId) {
  return client(`posts/user/${userId}/favorites`);
}

export {
  getHomepagePosts,
  getBlogPosts,
  getPostBySlug,
  deletePost,
  getUserPosts,
  addBlogPost,
  updatePost,
  favoritePost,
  unfavoritePost,
  getUserFavorites,
};
