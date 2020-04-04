import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useForm } from '../../../hooks';
import validate from '../../../utils/AddBlogPostValidationRules';
import { addBlogPost } from '../../../api/post';
import { useAlert } from '../../../context/AlertContext';
import BlogPostForm from '../../../components/layout/BlogPostForm';

function AddBlogPost({
  blog,
  body,
  title,
  tags,
  handleSubmit,
  handleChange,
  errors,
  loading,
  ...props
}) {
  return (
    <div className="max-w-screen-md mx-auto border-b border-gray-400 mt-6 relative">
      <h1 className="text-3xl text-center leading-loose">
        Add Blog Post To
        <span className="uppercase text-green-600 hover:text-green-700 pl-4">
          <Link to={`/blogs/${blog.slug}`}>{blog.name}</Link>
        </span>
      </h1>
      <BlogPostForm
        title={title}
        body={body}
        tags={tags}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        errors={errors}
        loading={loading}
      />
    </div>
  );
}

AddBlogPost.propTypes = {
  blog: PropTypes.object.isRequired,
  tags: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

function AddBlogPostContainer({ blog, ...props }) {
  const {
    handleChange,
    handleSubmit,
    handleReset,
    values: { title, tags, body },
    errors,
    setErrors,
  } = useForm(
    {
      title: '',
      tags: '',
      body: '',
    },
    handleAddBlogPost,
    validate
  );

  const { setAlert } = useAlert();
  const [status, setStatus] = React.useState('idle');

  function handleAddBlogPost() {
    if (blog === null) return;
    const data = { title, body, tags: tags.split(',') };
    setStatus('adding');
    addBlogPost(blog._id, data)
      .then(() => {
        handleReset();
        setStatus('added');
        setAlert('success', 'Blog Post Added');
      })
      .catch((err) => {
        setStatus('error');
        if (err.errors) {
          setErrors(err.errors);
        } else {
          setErrors({
            message:
              err.message ||
              'There is a problem with the server. Try again later.',
          });
        }
      });
  }

  return (
    <AddBlogPost
      blog={blog}
      tags={tags}
      title={title}
      body={body}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      errors={errors}
      loading={status === 'adding'}
    />
  );
}

AddBlogPostContainer.propTypes = {
  blog: PropTypes.object,
};

export default AddBlogPostContainer;
