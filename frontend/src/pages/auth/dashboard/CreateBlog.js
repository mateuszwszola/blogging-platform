import React from 'react';
import PropTypes from 'prop-types';
import { createBlog } from 'api/blog';
import useImgUpload from 'hooks/useImgUpload';
import useForm from 'hooks/useForm';
import useStatus from 'hooks/useStatus';
import { LoadingWithOverlay } from 'components/Loading';
import validate from 'utils/CreateBlogValidationRules';
import { useAlert } from 'context/AlertContext';

import formatBlogData from 'utils/formatBlogData';

import CreateBlogForm from 'components/layout/CreateBlogForm';

function CreateBlog({ addBlog }) {
  const {
    loading,
    error,
    requestStarted,
    requestSuccessful,
    requestFailed,
  } = useStatus();

  const { setAlert } = useAlert();

  const {
    handleChange,
    handleSubmit,
    handleReset: handleFormReset,
    values: { name, description, bgImgUrl, imgAttribution },
    errors,
    setErrors,
  } = useForm(
    {
      name: '',
      description: '',
      bgImgUrl: '',
      imgAttribution: '',
    },
    handleCreateBlog,
    validate
  );

  const { photoFile, handlePhotoChange, handlePhotoReset } = useImgUpload();

  function handleCreateBlog() {
    const formData = formatBlogData({
      name,
      description,
      bgImgUrl,
      imgAttribution,
      photo: photoFile,
    });

    requestStarted();

    createBlog({ formData })
      .then((response) => {
        requestSuccessful();
        handleFormReset();
        addBlog(response.blog);
        setAlert('success', 'Blog created');
      })
      .catch((err) => {
        requestFailed();
        if (err.errors) {
          setErrors(err.errors);
        } else {
          setErrors({
            message: err.message || 'There was a problem with the server',
          });
        }
      });
  }

  return (
    <div className="max-w-screen-md mx-auto border-b border-gray-400 mt-6 relative">
      {error ? (
        <p className="bg-red-500 text-white text-sm text-center my-2 rounded py-1">
          {errors.message || 'There was a problem with the server'}
        </p>
      ) : loading ? (
        <LoadingWithOverlay />
      ) : null}
      <h1 className="text-3xl text-center leading-loose">Create A Blog</h1>

      <CreateBlogForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        photoFile={photoFile}
        handlePhotoChange={handlePhotoChange}
        handlePhotoReset={handlePhotoReset}
        loading={loading}
        errors={errors}
        name={name}
        description={description}
        imgAttribution={imgAttribution}
        bgImgUrl={bgImgUrl}
      />
    </div>
  );
}

CreateBlog.propTypes = {
  addBlog: PropTypes.func.isRequired,
};

export default CreateBlog;
