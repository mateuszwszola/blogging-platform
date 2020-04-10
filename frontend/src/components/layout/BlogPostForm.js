import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, InputSubmit } from './Input';
import Loading from '../Loading';
import Editor from '../Editor';

function BlogPostForm({
  title,
  tags,
  bgImg,
  imgAttribution,
  handleSubmit,
  handleChange,
  editorState,
  updateEditorState,
  errors,
  loading,
  update,
}) {
  const filteredTagsArr = tags.split(',').filter((t) => t.trim());

  return (
    <div className="relative">
      {loading && (
        <div className="z-30 absolute top-0 bottom-0 left-0 right-0">
          <Loading />
        </div>
      )}

      <InputGroup
        isError={
          !!(Object.keys(errors).length > 0 && (errors.title || errors.message))
        }
        errors={errors}
        name="title"
        value={title}
        handleChange={handleChange}
        placeholder="Post Title"
        classnames="border border-gray-400"
        label="Post Title"
      />

      <InputGroup
        name="bgImg"
        value={bgImg}
        handleChange={handleChange}
        placeholder="https://"
        classnames="border border-gray-400"
        label="Background Image"
        type="url"
        pattern="https://.*"
      />

      <InputGroup
        name="imgAttribution"
        value={imgAttribution}
        handleChange={handleChange}
        placeholder="Photo By ... On ..."
        classnames="border border-gray-400"
        label="Image Attribution"
      />

      <InputGroup
        isError={
          !!(Object.keys(errors).length > 0 && (errors.tags || errors.message))
        }
        errors={errors}
        name="tags"
        placeholder="Give a post tags (separate them using comma)"
        classnames="border border-gray-400"
        value={tags}
        handleChange={handleChange}
        label="Tags (what the post is about?)"
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
    </div>
  );
}

BlogPostForm.defaultProps = {
  update: false,
};

BlogPostForm.propTypes = {
  title: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  bgImg: PropTypes.string.isRequired,
  imgAttribution: PropTypes.string.isRequired,
  editorState: PropTypes.object.isRequired,
  updateEditorState: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  update: PropTypes.bool,
};

export default BlogPostForm;
