import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useBlogBySlug } from 'hooks/useBlog';
import { useBlogPosts } from 'hooks/usePost';
import Posts from 'components/Posts';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';

function Blog({ blog }) {
  const { status, error, data: posts } = useBlogPosts(blog._id);

  const photoSrc =
    (blog.bgImg && blog.bgImg.photoURL) || 'https://picsum.photos/1280/720';

  return (
    <div className="py-16">
      <div
        className="w-full h-64 relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${photoSrc})`,
        }}
      >
        <div className="w-full h-full absolute top-0 left-0 bottom-0 right-0 bg-black bg-opacity-50">
          <div className="h-full flex flex-col justify-center items-center px-2">
            <h1 className="text-4xl lg:text-6xl text-center leading-loose my-2 text-white">
              {blog.name}
            </h1>
            {blog.description && (
              <p className="text-center text-lg uppercase text-gray-200 rounded bg-white bg-opacity-25 py-1 px-2">
                {blog.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="py-16 max-w-screen-xl mx-auto">
        {error ? (
          <DisplayError
            msg={error.message || 'There was a problem with fetching the posts'}
          />
        ) : status === 'loading' ? (
          <Loading />
        ) : (
          <Posts posts={posts} />
        )}
      </div>
    </div>
  );
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};

function BlogContainer(props) {
  const { blogSlug } = useParams();
  const { status, data: blog, error } = useBlogBySlug(blogSlug);

  if (status === 'loading') {
    return <Loading />;
  }

  if (error) {
    return (
      <DisplayError
        msg={error.message || 'There was a problem fetching a blog'}
      />
    );
  }

  return <Blog blog={blog} />;
}

export default BlogContainer;
