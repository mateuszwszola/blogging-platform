import React from 'react';
import validate from 'utils/createBlogValidationRules';
import { useAlert } from 'context/AlertContext';
import { useCreateBlog } from 'hooks/useBlog';
import usePhotoFile from 'hooks/usePhotoFile';
import useForm from 'hooks/useForm';
import BlogForm from 'components/BlogForm';
import { LoadingWithOverlay } from 'components/Loading';
import formatBlogData from 'utils/formatBlogData';

function CreateBlog() {
  const [createBlog, { status, error }] = useCreateBlog();

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

  const { photoFile, handlePhotoChange, handlePhotoReset } = usePhotoFile();

  function handleCreateBlog() {
    const formData = formatBlogData({
      name,
      description,
      bgImgUrl,
      imgAttribution,
      photo: photoFile,
    });

    createBlog(
      { formData },
      {
        onSuccess: () => {
          handleFormReset();
          setAlert('success', 'Blog created');
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
    <div className="relative max-w-screen-md mx-auto bg-white p-2 md:p-4 lg:p-6 xl:p-12 rounded-lg shadow-md">
      {error ? (
        <p className="bg-red-500 text-white text-sm text-center my-2 rounded py-1">
          {error.message || 'There was a problem with the server'}
        </p>
      ) : status === 'loading' ? (
        <LoadingWithOverlay />
      ) : null}

      <h1 className="text-2xl lg:text-3xl text-center leading-loose">
        Create Blog
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
        buttonMessage="Create blog"
      />
    </div>
  );
}

export default CreateBlog;
