import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InputGroup, InputSubmit } from './Input';
import Loading from '../Loading';
import Editor from '../Editor';
import ImgUploadInput from './Input/ImgUploadInput';

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
}) {
  const filteredTagsArr = tags.split(',').filter((t) => t.trim());
  const [uploadImg, setUploadImg] = useState(true);

  const toggleSetUploadImg = () => setUploadImg((show) => !show);

  return (
    <div className="relative">
      {loading && (
        <div className="z-30 absolute top-0 bottom-0 left-0 right-0">
          <Loading />
        </div>
      )}

      {errors.message && (
        <p className="text-red-500 text-sm text-center my-4">
          {errors.message}
        </p>
      )}

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
          className="bg-gray-100 mt-1 mb-2 px-2 py-1 text-sm uppercase rounded text-gray-700 font-normal border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
          onClick={toggleSetUploadImg}
        >
          {uploadImg ? 'Add image URL' : 'Upload img'}
        </button>

        <InputGroup
          name="imgAttribution"
          value={imgAttribution}
          handleChange={handleChange}
          placeholder="(optional) Photo By ..."
          classnames="border border-gray-400"
          label="Image Attribution"
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

        <InputSubmit
          onClick={handleSubmit}
          value={update ? 'Update Post' : 'Create Post'}
          classnames="w-1/2 max-w-sm mx-auto block my-6 bg-green-300 hover:bg-green-400 transition duration-100"
        />
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
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  update: PropTypes.bool,
};

export default BlogPostForm;
