import React from 'react';
import PropTypes from 'prop-types';
import { createBlog } from 'api/blog';
import useImgUpload from 'hooks/useImgUpload';
import useForm from 'hooks/useForm';
import useStatus from 'hooks/useStatus';
import { LoadingWithOverlay } from 'components/Loading';
import validate from 'utils/CreateBlogValidationRules';

import formatBlogData from 'utils/formatBlogData';

import CreateBlogForm from 'components/layout/CreateBlogForm';

function CreateBlog({ addBlog }) {
  const {
    status,
    requestStarted,
    requestSuccessful,
    requestFailed,
  } = useStatus();

  const {
    handleChange,
    handleSubmit,
    handleReset,
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
      photoFile,
    });

    requestStarted();
    createBlog({ formData })
      .then((response) => {
        requestSuccessful();
        handleReset();
        addBlog(response.blog);
      })
      .catch((err) => {
        requestFailed();
        if (err.errors) {
          setErrors(err.errors);
        } else {
          setErrors({
            message:
              err.message ||
              'There is a problem with the server. Try again later',
          });
        }
      });
  }

  const loading = status === 'pending';
  const success = status === 'resolved';

  return (
    <div className="max-w-screen-md mx-auto border-b border-gray-400 mt-6 relative">
      {errors.message ? (
        <p className="text-red-500 text-sm text-center my-2 rounded py-1">
          {errors.message}
        </p>
      ) : success ? (
        <p className="text-white bg-green-500 text-sm text-center my-2 rounded py-1">
          Successfully created a blog
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
