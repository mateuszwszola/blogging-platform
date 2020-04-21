import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'hooks';
import { convertToRaw } from 'draft-js';
import BlogPostForm from 'components/layout/BlogPostForm';
import validate from 'utils/AddBlogPostValidationRules';
import useEditorState from 'hooks/useEditorState';
import useImgUpload from 'hooks/useImgUpload';
import client from 'api/client';

function EditPost({ post, onUpdatePost }) {
  const [status, setStatus] = useState('idle');
  const {
    handleChange,
    handleSubmit,
    values: { title, tags, bgImgUrl, imgAttribution },
    errors,
    setErrors,
  } = useForm(
    {
      title: post.title,
      tags: post.tags.join(',') || '',
      bgImgUrl: post.bgImgUrl || '',
      imgAttribution: post.imgAttribution || '',
    },
    handleUpdateBlogPost,
    validate
  );
  const { editorState, updateEditorState } = useEditorState(post.body);
  const editorStatePlainText = editorState.getCurrentContent().getPlainText();

  const [photo, handlePhotoChange] = useImgUpload();

  function handleUpdateBlogPost() {
    if (!editorStatePlainText.trim()) {
      return setErrors({ body: 'post content is required' });
    }
    const data = {
      title,
      body: JSON.stringify({
        content: convertToRaw(editorState.getCurrentContent()),
      }),
      tags: tags
        .split(',')
        .filter((t) => t.trim())
        .join(','),
    };

    if (photo || bgImgUrl) {
      if (imgAttribution) {
        data.imgAttribution = imgAttribution;
      }
      if (photo) {
        data.photo = photo;
        delete data.bgImgUrl;
      } else {
        data.bgImgUrl = bgImgUrl;
        delete data.photo;
      }
    }

    const formData = new FormData();
    for (const field in data) {
      formData.append(field, data[field]);
    }

    setStatus('pending');

    client(`posts/${post._id}`, { formData, method: 'PUT' })
      .then((res) => {
        onUpdatePost(res.post);
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
    <div className="px-2 py-4">
      <h1 className="text-center text-2xl md:text-3xl">Edit Post</h1>

      <BlogPostForm
        title={title}
        tags={tags}
        bgImgUrl={bgImgUrl}
        imgAttribution={imgAttribution}
        handlePhotoChange={handlePhotoChange}
        editorState={editorState}
        updateEditorState={updateEditorState}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        errors={errors}
        loading={status === 'pending'}
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
