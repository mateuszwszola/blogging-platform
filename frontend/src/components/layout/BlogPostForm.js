import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InputGroup } from './Input';
import { LoadingWithOverlay } from '../Loading';
import Editor from '../Editor';
import ImgUploadInput from './Input/ImgUploadInput';
import { Button } from './Button';

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

      <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
        <InputGroup
          isError={!!(Object.keys(errors).length > 0 && errors.title)}
          errors={errors}
          name="title"
          value={title}
          handleChange={handleChange}
          placeholder="Post Title"
          classnames="border border-gray-400"
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
            classnames="border border-gray-400"
            label="Background Image"
            type="url"
            pattern="https://.*"
          />
        )}

        <button
          type="button"
          className="inline-block bg-white shadow-xs my-2 px-2 py-1 text-xs font-medium uppercase rounded text-gray-700 tracking-wide border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
          onClick={toggleSetUploadImg}
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
          isError={!!(Object.keys(errors).length > 0 && errors.imgAttribution)}
          errors={errors}
          name="imgAttribution"
          value={imgAttribution}
          handleChange={handleChange}
          placeholder="Photo By ..."
          classnames="border border-gray-400"
          label="Image Attribution (optional)"
        />

        <InputGroup
          isError={!!(Object.keys(errors).length > 0 && errors.tags)}
          errors={errors}
          name="tags"
          placeholder="Give a post tags (separate them using comma)"
          classnames="border border-gray-400"
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
          <Editor
            editorState={editorState}
            updateEditorState={updateEditorState}
            isError={
              !!(
                Object.keys(errors).length > 0 &&
                (errors.body || errors.messasge)
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
            <span className="uppercase font-bold">
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
