import client from './client';

function getBlogPosts(blogId) {
  return client(`posts/blog/${blogId}`);
}

function getPostBySlug(slug) {
  return client(`posts/slug/${slug}`);
}

function getUserPosts() {
  return client('posts');
}

function addBlogPost(blogId, data) {
  return client(`posts/${blogId}`, data);
}

function updatePost(postId, data) {
  return client(`posts/${postId}`, { data, method: 'PUT' });
}

function deletePost(postId) {
  return client(`posts/${postId}`, { method: 'DELETE' });
}

export {
  getBlogPosts,
  getPostBySlug,
  deletePost,
  getUserPosts,
  addBlogPost,
  updatePost,
};
