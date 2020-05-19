import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useBlog } from 'hooks/useBlog';
import useAsync from 'hooks/useAsync';
import { getBlogPosts } from 'api/post';

import Posts from 'components/Posts';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import { fetchBlogBySlug } from 'actions/blogActions';

const formatData = (result) => result.posts;

function Blog({ blog }) {
  const { loading, error, result: posts } = useAsync({
    promiseFn: getBlogPosts,
    immediate: true,
    data: blog._id,
    formatData,
  });

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

      <div className="py-16">
        {error ? (
          <DisplayError msg="There was a problem with fetching the posts" />
        ) : loading ? (
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
  const { blog, loading, error, dispatch } = useBlog();

  useEffect(() => {
    if (!blogSlug) return;
    dispatch(fetchBlogBySlug(blogSlug));
  }, [blogSlug, dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <DisplayError msg="There was a problem fetching a blog" />;
  }

  return <Blog blog={blog} />;
}

export default BlogContainer;
