import React from 'react';
import { useParams } from 'react-router-dom';
import { useBlogBySlug } from 'hooks/useBlog';
import { useBlogPosts } from 'hooks/usePost';
import Posts from 'components/Posts';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';

function Blog() {
  const { blogSlug } = useParams();
  const { status: blogStatus, data: blog, error: blogError } = useBlogBySlug(
    blogSlug
  );
  const { status: postsStatus, data: posts, error: postsError } = useBlogPosts(
    blog && blog._id
  );

  if (blogStatus === 'loading') {
    return <Loading />;
  }

  if (blogError) {
    return (
      <DisplayError
        msg={blogError.message || 'There was a problem fetching a blog'}
      />
    );
  }

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
        {postsError ? (
          <DisplayError
            msg={
              postsError.message ||
              'There was a problem with fetching the posts'
            }
          />
        ) : postsStatus === 'loading' ? (
          <Loading />
        ) : (
          <Posts posts={posts} />
        )}
      </div>
    </div>
  );
}

export default Blog;
