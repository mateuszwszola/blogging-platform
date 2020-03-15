import api from './api';

function getBlogPosts(blogId) {
  return api(`posts/blog/${blogId}`);
}

function getPostBySlug(slug) {
  return api(`posts/slug/${slug}`);
}

function getUserPosts() {
  return api('posts');
}

function addBlogPost(blogId, data) {
  return api(`posts/${blogId}`, 'POST', { body: data });
}

function deletePost(postId) {
  return api(`posts/${postId}`, 'DELETE');
}

export { getBlogPosts, getPostBySlug, deletePost, getUserPosts, addBlogPost };