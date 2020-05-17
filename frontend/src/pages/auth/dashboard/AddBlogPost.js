import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAlert } from 'context/AlertContext';
import BlogPostForm from 'components/layout/BlogPostForm';
import useEditorState from 'hooks/useEditorState';
import useImgUpload from 'hooks/useImgUpload';
import useStatus from 'hooks/useStatus';
import useForm from 'hooks/useForm';
import { addBlogPost } from 'api/post';
import formatBlogPostData from 'utils/formatBlogPostData';
import validate from 'utils/AddBlogPostValidationRules';

function AddBlogPost({ blog }) {
  const {
    loading,
    requestStarted,
    requestSuccessful,
    requestFailed,
  } = useStatus();
  const {
    handleChange,
    handleSubmit,
    handleReset: handleFormReset,
    values: { title, tags, bgImgUrl, imgAttribution },
    errors,
    setErrors,
  } = useForm(
    {
      title: '',
      tags: '',
      bgImgUrl: '',
      imgAttribution: '',
    },
    handleAddBlogPost,
    validate
  );
  const {
    editorState,
    updateEditorState,
    resetEditorState,
    editorStatePlainText,
  } = useEditorState();
  const { photoFile, handlePhotoChange, handlePhotoReset } = useImgUpload();
  const { setAlert } = useAlert();

  function handleAddBlogPost() {
    if (!blog) return;
    if (!editorStatePlainText.trim()) {
      return setErrors({ ...errors, body: 'post content is required' });
    }

    const formData = formatBlogPostData({
      title,
      editorState,
      tags,
      photo: photoFile,
      bgImgUrl,
      imgAttribution,
    });

    requestStarted();

    addBlogPost(blog._id, { formData })
      .then((res) => {
        requestSuccessful();
        handleFormReset();
        resetEditorState();
        setAlert('success', 'Blog Post Added');
      })
      .catch((err) => {
        requestFailed();
        if (err.errors) {
          setErrors(err.errors);
        } else {
          setErrors({
            message: err.message || 'There is a problem with the server',
          });
        }
      });
  }

  return (
    <div className="max-w-screen-md mx-auto mt-6 relative bg-white p-2 md:p-4 lg:p-6 xl:p-12 rounded-lg shadow-md mb-4">
      <h1 className="text-2xl lg:text-3xl text-center leading-loose">
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
        bgImgUrl={bgImgUrl}
        imgAttribution={imgAttribution}
        photoFile={photoFile}
        handlePhotoChange={handlePhotoChange}
        handlePhotoReset={handlePhotoReset}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        errors={errors}
        loading={loading}
      />
    </div>
  );
}

AddBlogPost.propTypes = {
  blog: PropTypes.object,
};

export default AddBlogPost;
