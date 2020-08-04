import React from 'react';
import PropTypes from 'prop-types';
import { useAlert } from 'context/AlertContext';
import useForm from 'hooks/useForm';
import usePhotoFile from 'hooks/usePhotoFile';
import { useUpdateBlog } from 'hooks/useBlog';
import BlogForm from 'components/BlogForm';
import { LoadingWithOverlay } from 'components/Loading';
import validate from 'utils/createBlogValidationRules';
import formatBlogData from 'utils/formatBlogData';

function UpdateBlog({ blog, onUpdate }) {
  const [updateBlog, { status, error }] = useUpdateBlog();

  const { setAlert } = useAlert();

  const {
    handleChange,
    handleSubmit,
    values: { name, description, bgImgUrl, imgAttribution },
    errors,
    setErrors,
  } = useForm(
    {
      name: blog.name || '',
      description: blog.description || '',
      bgImgUrl: '',
      imgAttribution: (blog.bgImg && blog.bgImg.img_attribution) || '',
    },
    handleBlogUpdate,
    validate
  );

  const { photoFile, handlePhotoChange, handlePhotoReset } = usePhotoFile();

  function handleBlogUpdate() {
    const formData = formatBlogData({
      name,
      description,
      bgImgUrl,
      imgAttribution,
      photo: photoFile,
    });

    updateBlog(
      { blogId: blog._id, formData },
      {
        onSuccess: () => {
          setAlert('success', 'Blog updated');
          onUpdate();
        },
        onError: (err) => {
          if (err.errors) {
            setErrors(err.errors);
          } else {
            setErrors(err);
          }
        },
      }
    );
  }

  return (
    <div className="max-w-screen-md mx-auto mt-6 relative bg-white p-2 md:p-4 lg:p-6 xl:p-12 rounded-lg shadow-md mb-12">
      {error ? (
        <p className="bg-red-500 text-white text-sm text-center my-2 rounded py-1">
          {error.message || 'There was a problem with the server'}
        </p>
      ) : status === 'loading' ? (
        <LoadingWithOverlay />
      ) : null}
      <h1 className="text-2xl lg:text-3xl text-center leading-loose">
        Update Blog
      </h1>

      <BlogForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        photoFile={photoFile}
        handlePhotoChange={handlePhotoChange}
        handlePhotoReset={handlePhotoReset}
        loading={status === 'loading'}
        errors={errors}
        name={name}
        description={description}
        imgAttribution={imgAttribution}
        bgImgUrl={bgImgUrl}
        buttonMessage="Update blog"
      />
    </div>
  );
}

UpdateBlog.propTypes = {
  blog: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default UpdateBlog;
