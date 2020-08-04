import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAlert } from 'context/AlertContext';
import useEditorState from 'hooks/useEditorState';
import usePhotoFile from 'hooks/usePhotoFile';
import useForm from 'hooks/useForm';
import { useCreatePost } from 'hooks/usePost';
import BlogPostForm from 'components/BlogPostForm';
import formatBlogPostData from 'utils/formatBlogPostData';
import validate from 'utils/addBlogPostValidationRules';
import { convertToRaw } from 'draft-js';

function AddBlogPost({ blog }) {
  const [createPost, { status }] = useCreatePost();
  const { setAlert } = useAlert();
  const { photoFile, handlePhotoChange, handlePhotoReset } = usePhotoFile();
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
  const postBodyTmp = window.localStorage.getItem(`${blog.slug}-tmp`);
  const {
    editorState,
    updateEditorState,
    resetEditorState,
    editorStatePlainText,
  } = useEditorState(postBodyTmp);

  const saveContent = (content) => {
    const { slug } = blog;
    window.localStorage.setItem(
      `${slug}-tmp`,
      JSON.stringify({ content: convertToRaw(content) })
    );
  };

  const handleEditorStateChange = (newEditorState) => {
    saveContent(newEditorState.getCurrentContent());
    updateEditorState(newEditorState);
  };

  async function handleAddBlogPost() {
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

    await createPost(
      { blogId: blog._id, values: { formData } },
      {
        onSuccess() {
          handleFormReset();
          resetEditorState();
          setAlert('success', 'Blog Post Added');
        },
        onError(err) {
          if (err.errors) {
            setErrors(err.errors);
          } else {
            setErrors({
              message: err.message || 'There is a problem with the server',
            });
          }
        },
      }
    );
  }

  return (
    <div className="max-w-screen-md mx-auto mt-6 relative bg-white p-2 md:p-4 lg:p-6 xl:p-12 rounded-lg shadow-md mb-64">
      <h1 className="text-2xl lg:text-3xl text-center leading-loose">
        Add Blog Post To
        <span className="uppercase text-green-600 hover:text-green-700 pl-4">
          <Link to={`/blogs/${blog.slug}`}>{blog.name}</Link>
        </span>
      </h1>

      <BlogPostForm
        editorState={editorState}
        updateEditorState={handleEditorStateChange}
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
        loading={status === 'loading'}
      />
    </div>
  );
}

AddBlogPost.propTypes = {
  blog: PropTypes.object,
};

export default AddBlogPost;
