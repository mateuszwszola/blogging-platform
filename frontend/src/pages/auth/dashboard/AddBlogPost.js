import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { convertToRaw } from 'draft-js';
import { useForm } from 'hooks';
import validate from 'utils/AddBlogPostValidationRules';
import { addBlogPost } from 'api/post';
import { useAlert } from 'context/AlertContext';
import BlogPostForm from 'components/layout/BlogPostForm';
import useEditorState from 'hooks/useEditorState';

function AddBlogPost({
  blog,
  title,
  tags,
  editorState,
  updateEditorState,
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
        editorState={editorState}
        updateEditorState={updateEditorState}
        title={title}
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
  editorState: PropTypes.object.isRequired,
  updateEditorState: PropTypes.func.isRequired,
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
    values: { title, tags },
    errors,
    setErrors,
  } = useForm(
    {
      title: '',
      tags: '',
    },
    handleAddBlogPost,
    validate
  );

  const { setAlert } = useAlert();
  const [status, setStatus] = React.useState('idle');
  const { editorState, updateEditorState, resetEditorState } = useEditorState();

  function handleAddBlogPost() {
    if (blog === null) return;
    const data = {
      title,
      body: JSON.stringify({
        content: convertToRaw(editorState.getCurrentContent()),
      }),
      tags: tags.split(','),
    };

    setStatus('adding');
    addBlogPost(blog._id, data)
      .then(() => {
        handleReset();
        resetEditorState();
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
      editorState={editorState}
      updateEditorState={updateEditorState}
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
