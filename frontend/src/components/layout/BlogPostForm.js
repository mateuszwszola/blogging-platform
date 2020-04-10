import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, InputSubmit } from './Input';
import Loading from '../Loading';
import Editor from '../Editor';

function BlogPostForm({
  title,
  tags,
  handleSubmit,
  handleChange,
  editorState,
  updateEditorState,
  errors,
  loading,
}) {
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
      <div className="py-2">
        {typeof tags === 'string' &&
          tags.split(',').length > 1 &&
          tags.split(',').map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="bg-blue-500 p-2 mt-1 text-blue-100 rounded mr-1"
            >
              {tag}
            </span>
          ))}
      </div>

      <Editor editorState={editorState} updateEditorState={updateEditorState} />

      <InputSubmit
        onClick={handleSubmit}
        value="Create Post"
        classnames="w-1/2 max-w-sm mx-auto block my-6 bg-green-300 hover:bg-green-400 transition duration-100"
      />
    </div>
  );
}

BlogPostForm.propTypes = {
  title: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  editorState: PropTypes.object.isRequired,
  updateEditorState: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default BlogPostForm;
