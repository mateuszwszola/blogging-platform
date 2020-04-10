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

function AddBlogPost({ blog, ...props }) {
  const [status, setStatus] = React.useState('idle');
  const {
    handleChange,
    handleSubmit,
    handleReset,
    values: { title, tags, bgImg, imgAttribution },
    errors,
    setErrors,
  } = useForm(
    {
      title: '',
      tags: '',
      bgImg: '',
      imgAttribution: '',
    },
    handleAddBlogPost,
    validate
  );

  const { editorState, updateEditorState, resetEditorState } = useEditorState();
  const { setAlert } = useAlert();

  const editorStatePlainText = editorState.getCurrentContent().getPlainText();

  function handleAddBlogPost() {
    if (blog === null) return;
    if (!editorStatePlainText.trim()) {
      return setErrors({ body: 'body is required' });
    }
    const data = {
      title,
      body: JSON.stringify({
        content: convertToRaw(editorState.getCurrentContent()),
      }),
      tags: tags.split(',').filter((t) => t.trim()),
      bgImg,
      imgAttribution,
    };

    setStatus('pending');
    addBlogPost(blog._id, data)
      .then(() => {
        handleReset();
        resetEditorState();
        setStatus('loaded');
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
        bgImg={bgImg}
        imgAttribution={imgAttribution}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        errors={errors}
        loading={status === 'pending'}
      />
    </div>
  );
}

AddBlogPost.propTypes = {
  blog: PropTypes.object,
};

export default AddBlogPost;
