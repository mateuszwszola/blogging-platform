import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup } from 'components/layout/Input';
import ImgUploadInput from 'components/layout/Input/ImgUploadInput';
import useToggle from 'hooks/useToggle';
import { Button } from 'components/layout/Button';

function CreateBlogForm({
  handleSubmit,
  handleChange,
  photoFile,
  handlePhotoChange,
  handlePhotoReset,
  loading,
  errors,
  name,
  description,
  imgAttribution,
  bgImgUrl,
}) {
  const [uploadImg, toggleUploadImg] = useToggle(true);

  return (
    <form
      onSubmit={handleSubmit}
      className={`${loading ? 'opacity-50' : 'opacity-100'}`}
      encType="multipart/form-data"
    >
      <InputGroup
        isError={
          !!(Object.keys(errors).length > 0 && (errors.name || errors.message))
        }
        errors={errors}
        name="name"
        placeholder="Give it a name"
        classnames="border border-gray-400"
        value={name}
        handleChange={handleChange}
        label="Blog Name"
      />
      <InputGroup
        isError={
          !!(
            Object.keys(errors).length > 0 &&
            (errors.description || errors.message)
          )
        }
        errors={errors}
        name="description"
        placeholder="What is your blog about?"
        classnames="border border-gray-400"
        value={description}
        handleChange={handleChange}
        label="Blog Description"
      />

      {uploadImg ? (
        <ImgUploadInput
          handleChange={handlePhotoChange}
          label="Background Image"
          photoFile={photoFile}
        />
      ) : (
        <InputGroup
          name="bgImgUrl"
          value={bgImgUrl}
          handleChange={handleChange}
          placeholder="https://"
          classnames="border border-gray-400"
          label="Background Image"
          type="url"
          pattern="https://.*"
        />
      )}

      <button
        type="button"
        className="inline-block bg-white shadow-xs my-2 px-2 py-1 text-xs font-medium uppercase rounded text-gray-700 tracking-wide border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
        onClick={toggleUploadImg}
      >
        {uploadImg ? 'Or Add image URL' : 'Or Upload img'}
      </button>

      {photoFile && (
        <button
          className="inline-block bg-white shadow-xs my-2 ml-2 px-2 py-1 text-xs font-medium uppercase rounded text-gray-700 tracking-wide border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
          onClick={handlePhotoReset}
        >
          Remove Photo
        </button>
      )}

      <InputGroup
        name="imgAttribution"
        value={imgAttribution}
        handleChange={handleChange}
        placeholder="Photo By ..."
        classnames="border border-gray-400"
        label="Image Attribution (optional)"
      />

      <div className="w-1/2 max-w-sm mx-auto my-6">
        <Button
          type="submit"
          disabled={loading}
          size="base"
          version="primary"
          fullWidth
          fullRounded
        >
          <span className="uppercase font-bold">Create blog</span>
        </Button>
      </div>
    </form>
  );
}

CreateBlogForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handlePhotoChange: PropTypes.func.isRequired,
  handlePhotoReset: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgAttribution: PropTypes.string.isRequired,
  bgImgUrl: PropTypes.string.isRequired,
};

export default CreateBlogForm;
