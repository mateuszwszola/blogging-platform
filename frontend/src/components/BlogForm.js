import React from 'react';
import PropTypes from 'prop-types';
import useToggle from 'hooks/useToggle';
import InputGroup from 'components/InputGroup';
import ImgUploadInput from 'components/ImgUploadInput';
import Button from 'components/Button';

function BlogForm({
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
  buttonMessage,
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
        classnames="border border-gray-400 bg-gray-100"
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
        classnames="border border-gray-400 bg-gray-100"
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
          classnames="border border-gray-400 bg-gray-100"
          label="Background Image"
          type="url"
          pattern="https://.*"
        />
      )}

      <div className="my-2 space-x-2">
        <Button onClick={toggleUploadImg} version="basic" size="sm">
          {uploadImg ? 'Or Add image URL' : 'Or Upload img'}
        </Button>
        {photoFile && (
          <Button onClick={handlePhotoReset} version="basic" size="sm">
            Unselect photo
          </Button>
        )}
      </div>

      <InputGroup
        name="imgAttribution"
        value={imgAttribution}
        handleChange={handleChange}
        placeholder="Photo By ..."
        classnames="border border-gray-400 bg-gray-100"
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
          <span className="uppercase">{buttonMessage}</span>
        </Button>
      </div>
    </form>
  );
}

BlogForm.propTypes = {
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
  buttonMessage: PropTypes.string.isRequired,
};

export default BlogForm;
