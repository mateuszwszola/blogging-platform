import client from './client';

function getBlogBySlugName(slug) {
  return client(`blogs/slug/${slug}`);
}

function getAllBlogs(cursor = 0, name) {
  let url = `blogs/all?cursor=${cursor}`;
  if (name) {
    url += `&name=${name}`;
  }
  return client(url);
}

function getUserBlogs(userId) {
  return client(`blogs/user/${userId}`);
}

function createBlog(data) {
  return client('blogs', data);
}

function updateBlog(blogId, data) {
  return client(`blogs/${blogId}`, { formData: data, method: 'PUT' });
}

function deleteBlog(blogId) {
  return client(`blogs/${blogId}`, { method: 'DELETE' });
}

export {
  getBlogBySlugName,
  getAllBlogs,
  getUserBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
};
