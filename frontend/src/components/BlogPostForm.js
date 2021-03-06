import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LoadingWithOverlay } from 'components/Loading';
import InputGroup from 'components/InputGroup';
import ImgUploadInput from 'components/ImgUploadInput';
import Button from 'components/Button';
import ContentEditor from './ContentEditor';

function BlogPostForm({
  title,
  tags,
  bgImgUrl,
  imgAttribution,
  handleSubmit,
  handleChange,
  editorState,
  updateEditorState,
  handlePhotoChange,
  errors,
  loading,
  update,
  photoFile,
  handlePhotoReset,
}) {
  const filteredTagsArr = tags.split(',').filter((t) => t.trim());
  const [uploadImg, setUploadImg] = useState(true);

  const toggleSetUploadImg = () => setUploadImg((show) => !show);

  return (
    <div className="relative">
      {loading ? (
        <LoadingWithOverlay />
      ) : errors.message ? (
        <p className="text-red-500 text-sm text-center my-4">
          {errors.message}
        </p>
      ) : null}

      <form
        onSubmit={handleSubmit}
        method="POST"
        encType="multipart/form-data"
        className={`${loading ? 'opacity-50' : 'opacity-100'}`}
      >
        <InputGroup
          isError={!!(Object.keys(errors).length > 0 && errors.title)}
          errors={errors}
          name="title"
          value={title}
          handleChange={handleChange}
          placeholder="Post Title"
          classnames="border border-gray-400 bg-gray-100"
          label="Post Title"
        />

        {uploadImg ? (
          <ImgUploadInput
            handleChange={handlePhotoChange}
            label="Background Image"
            photoFile={photoFile}
          />
        ) : (
          <InputGroup
            isError={!!(Object.keys(errors).length > 0 && errors.bgImgUrl)}
            errors={errors}
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
          <Button onClick={toggleSetUploadImg} version="basic" size="sm">
            {uploadImg ? 'Or Add image URL' : 'Or Upload img'}
          </Button>
          {photoFile && (
            <Button onClick={handlePhotoReset} version="basic" size="sm">
              Unselect photo
            </Button>
          )}
        </div>

        <InputGroup
          isError={!!(Object.keys(errors).length > 0 && errors.imgAttribution)}
          errors={errors}
          name="imgAttribution"
          value={imgAttribution}
          handleChange={handleChange}
          placeholder="Photo By ..."
          classnames="border border-gray-400 bg-gray-100"
          label="Image Attribution (optional)"
        />

        <InputGroup
          isError={!!(Object.keys(errors).length > 0 && errors.tags)}
          errors={errors}
          name="tags"
          placeholder="Give a post tags (separate them using comma)"
          classnames="border border-gray-400 bg-gray-100"
          value={tags}
          handleChange={handleChange}
          label="Tags (what is the post about?)"
        />
        <div className="mt-1">
          {filteredTagsArr.length > 0 &&
            filteredTagsArr.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="inline-block bg-blue-500 px-2 py-1 text-blue-100 rounded mr-1"
              >
                {tag}
              </span>
            ))}
        </div>

        <div className="mt-4">
          <p className="py-2 text-sm uppercase text-gray-800 font-semibold">
            Post content
          </p>
          <ContentEditor
            editorState={editorState}
            updateEditorState={updateEditorState}
            isError={
              !!(
                Object.keys(errors).length > 0 &&
                (errors.body || errors.message)
              )
            }
          />
          {errors.body && <p className="text-red-500 text-sm">{errors.body}</p>}
        </div>

        <div className="w-1/2 max-w-sm mx-auto my-6">
          <Button
            type="submit"
            disabled={loading}
            size="base"
            version="primary"
            fullWidth
            fullRounded
          >
            <span className="uppercase">
              {update ? 'Update Post' : 'Create Post'}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}

BlogPostForm.defaultProps = {
  update: false,
};

BlogPostForm.propTypes = {
  title: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  bgImgUrl: PropTypes.string.isRequired,
  imgAttribution: PropTypes.string.isRequired,
  editorState: PropTypes.object.isRequired,
  updateEditorState: PropTypes.func.isRequired,
  handlePhotoChange: PropTypes.func.isRequired,
  handlePhotoReset: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  update: PropTypes.bool,
};

export default BlogPostForm;
