import React from 'react';
import PropTypes from 'prop-types';
import validate from 'utils/AddBlogPostValidationRules';
import formatBlogPostData from 'utils/formatBlogPostData';
import useEditorState from 'hooks/useEditorState';
import useImgUpload from 'hooks/useImgUpload';
import useForm from 'hooks/useForm';
import useStatus from 'hooks/useStatus';
import { updatePost } from 'api/post';
import BlogPostForm from 'components/layout/BlogPostForm';

function EditPost({ post, onUpdatePost }) {
  const { loading, requestFailed, requestStarted } = useStatus();
  const {
    handleChange,
    handleSubmit,
    values: { title, tags, bgImgUrl, imgAttribution },
    errors,
    setErrors,
  } = useForm(
    {
      title: post.title || '',
      tags: post.tags.join(',') || '',
      bgImgUrl: post.bgImgUrl || '',
      imgAttribution: post.imgAttribution || '',
    },
    handleUpdateBlogPost,
    validate
  );
  const {
    editorState,
    updateEditorState,
    editorStatePlainText,
  } = useEditorState(post.body);
  const { photoFile, handlePhotoChange, handlePhotoReset } = useImgUpload();

  function handleUpdateBlogPost() {
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

    updatePost(post._id, { formData })
      .then((res) => {
        onUpdatePost(res.post);
      })
      .catch((err) => {
        requestFailed();
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
    <div className="px-2 py-4">
      <h1 className="text-center text-2xl md:text-3xl">Edit Post</h1>

      <BlogPostForm
        title={title}
        tags={tags}
        bgImgUrl={bgImgUrl}
        imgAttribution={imgAttribution}
        handlePhotoChange={handlePhotoChange}
        handlePhotoReset={handlePhotoReset}
        editorState={editorState}
        updateEditorState={updateEditorState}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        errors={errors}
        loading={loading}
        update={true}
      />
    </div>
  );
}

EditPost.propTypes = {
  post: PropTypes.object.isRequired,
  onUpdatePost: PropTypes.func.isRequired,
};

export default EditPost;
