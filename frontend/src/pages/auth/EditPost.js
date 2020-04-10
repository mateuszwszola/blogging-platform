import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'hooks';
import BlogPostForm from 'components/layout/BlogPostForm';
import validate from 'utils/AddBlogPostValidationRules';

function EditPost({
  title,
  tags,
  body,
  handleChange,
  handleSubmit,
  errors,
  status,
}) {
  const loading = status === 'pending';
  return (
    <div>
      <h1 className="text-center text-2xl">Edit Post</h1>
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

EditPost.propTypes = {
  title: PropTypes.string.isRequired,
  tags: PropTypes.array,
  body: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
};

function EditPostContainer({ post }) {
  console.log(post);
  const {
    handleChange,
    handleSubmit,
    handleReset,
    values: { title, tags, body },
    errors,
    setErrors,
  } = useForm(
    {
      title: post.title,
      body: post.body,
      tags: post.tags || [],
    },
    () => console.log('save changes'),
    validate
  );
  const [status, setStatus] = useState('idle');

  return (
    <EditPost
      title={title}
      tags={tags}
      body={body}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      errors={errors}
      status={status}
    />
  );
}

EditPostContainer.propTypes = {
  post: PropTypes.object.isRequired,
};

export default EditPostContainer;
