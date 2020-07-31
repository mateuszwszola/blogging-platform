import React from 'react';
import PropTypes from 'prop-types';
import useEditorState from 'hooks/useEditorState';
import usePhotoFile from 'hooks/usePhotoFile';
import useForm from 'hooks/useForm';
import { useUpdatePost } from 'hooks/usePost';
import BlogPostForm from 'components/BlogPostForm';
import validate from 'utils/addBlogPostValidationRules';
import formatBlogPostData from 'utils/formatBlogPostData';

function EditPost({ post, onUpdatePost }) {
  const [updatePost, { status }] = useUpdatePost();
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
      bgImgUrl: '',
      imgAttribution: (post.bgImg && post.bgImg.img_attribution) || '',
    },
    handleUpdateBlogPost,
    validate
  );
  const {
    editorState,
    updateEditorState,
    editorStatePlainText,
  } = useEditorState(post.body);
  const { photoFile, handlePhotoChange, handlePhotoReset } = usePhotoFile();

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

    updatePost(
      { postId: post._id, formData },
      {
        onSuccess: () => {
          onUpdatePost();
        },
        onError: (err) => {
          if (err.errors) {
            setErrors(err.errors);
          } else {
            setErrors({
              message:
                err.message ||
                'There is a problem with the server. Try again later.',
            });
          }
        },
      }
    );
  }

  return (
    <div className="px-2 py-4">
      <h1 className="text-center text-2xl md:text-3xl">Edit Post</h1>

      <BlogPostForm
        photoFile={photoFile}
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
        loading={status === 'loading'}
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
