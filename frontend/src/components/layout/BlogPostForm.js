import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, InputSubmit, TextareaGroup } from './Input';
import Loading from '../Loading';

function BlogPostForm({
  title,
  body,
  tags,
  handleSubmit,
  handleChange,
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
      <form onSubmit={handleSubmit}>
        <InputGroup
          isError={
            !!(
              Object.keys(errors).length > 0 &&
              (errors.title || errors.message)
            )
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
            !!(
              Object.keys(errors).length > 0 &&
              (errors.tags || errors.message)
            )
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
        <TextareaGroup
          isError={
            !!(
              Object.keys(errors).length > 0 &&
              (errors.body || errors.message)
            )
          }
          errors={errors}
          name="body"
          value={body}
          handleChange={handleChange}
          label="Post Body"
          placeholder="Post Content (You can use markdown)"
          className="bg-gray-100 rounded py-2 px-4 outline-none focus:shadow-outline w-full border border-gray-400"
          cols="30"
          rows="10"
        />
        <InputSubmit
          value="Create Post"
          classnames="w-1/2 max-w-sm mx-auto block my-6 bg-green-300 hover:bg-green-400 transition duration-100"
        />
      </form>
    </div>
  );
}

BlogPostForm.propTypes = {
  title: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default BlogPostForm;
