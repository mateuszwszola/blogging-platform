import client from './client';

function getHomepagePosts(cursor = 0, searchKey) {
  let url = `posts/all?cursor=${cursor}`;
  if (searchKey) {
    url += `&title=${searchKey}`;
  }
  return client(url);
}

function getBlogPosts(blogId) {
  return client(`posts/blog/${blogId}`);
}

function getUserPosts(userId, cursor = 0) {
  return client(`posts/user/${userId}?cursor=${cursor}`);
}

function getUserFavorites(userId, cursor = 0) {
  return client(`posts/user/${userId}/favorites?cursor=${cursor}`);
}

function getPostBySlug(slug) {
  return client(`posts/slug/${slug}`);
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
