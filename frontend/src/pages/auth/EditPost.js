import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'hooks';
import { convertToRaw } from 'draft-js';
import BlogPostForm from 'components/layout/BlogPostForm';
import validate from 'utils/AddBlogPostValidationRules';
import useEditorState from 'hooks/useEditorState';
import { updatePost } from 'api/post';

function EditPost({ post, onUpdatePost }) {
  const {
    handleChange,
    handleSubmit,
    values: { title, tags, bgImg, imgAttribution },
    errors,
    setErrors,
  } = useForm(
    {
      title: post.title,
      tags: post.tags.join(',') || '',
      bgImg: post.bgImg || '',
      imgAttribution: post.imgAttribution || '',
    },
    handleUpdateBlogPost,
    validate
  );
  const [status, setStatus] = useState('idle');
  const { editorState, updateEditorState } = useEditorState(post.body);
  const editorStatePlainText = editorState.getCurrentContent().getPlainText();

  function handleUpdateBlogPost() {
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
    updatePost(post._id, data)
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
      <h1 className="text-center text-2xl">Edit Post</h1>
      <BlogPostForm
        title={title}
        tags={tags}
        bgImg={bgImg}
        imgAttribution={imgAttribution}
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
