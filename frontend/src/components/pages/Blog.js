import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useBlogBySlugName } from '../../hooks/useBlog';
import { useBlogPosts } from '../../hooks/usePost';
import Posts from '../Posts';

function Blog({ blog, ...props }) {
  const [posts, status] = useBlogPosts(blog._id);

  return (
    <div className="md:pt-16 pb-16 max-w-screen-xl mx-auto mt-6">
      <div className="py-4">
          <h1 className="text-3xl text-center leading-loose my-2">{blog.name}</h1>
          {blog.description && <p className="text-center text-lg text-gray-700 uppercase">{blog.description}</p>}
      </div>
      {status === 'loading' ? (
        <div>Loading...</div>
      ) : (
        <Posts posts={posts} />
      )}
    </div>
  );
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};

function BlogContainer(props) {
  const { blogSlug } = useParams();
  const [blog, status] = useBlogBySlugName(blogSlug);
  
  if (status === 'loading') {
    return <div className="mt-16">Loading...</div>;
  }

  if (status === 'error') {
    return <div className="mt-16">There is a problem with the server. Try reload the page</div>;
  }

  return <Blog blog={blog} />;
}

export default BlogContainer;
