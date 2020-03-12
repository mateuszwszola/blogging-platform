import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { InputGroup, InputSubmit } from '../../../layout/Input';

function AddBlogPost({ title, handleTitleChange, body, handleBodyChange }) {
  const { blogName } = useParams();

  return (
    <div className="max-w-screen-md mx-auto border-b border-gray-400 mt-6">
      <h1 className="text-3xl text-center leading-loose">
        Add Blog Post To
        <span className="uppercase text-green-600 pl-4">{blogName}</span>
      </h1>
      <form>
        <InputGroup
          name="title"
          value={title}
          handleChange={handleTitleChange}
          placeholder="Post Title"
          classnames="border border-gray-400"
          label="Post Title"
        />
        <label>
          <span className="text-sm uppercase text-gray-800 font-semibold">
            Post Body
          </span>
          <textarea
            name="body"
            value={body}
            onChange={handleBodyChange}
            placeholder="Post Content (You can use markdown)"
            className="bg-gray-100 rounded py-2 px-4 outline-none focus:shadow-outline w-full border border-gray-400"
            cols="30"
            rows="10"
          ></textarea>
        </label>
        <InputSubmit
          value="Create Post"
          classnames="w-1/2 max-w-sm mx-auto block my-6 bg-green-300 hover:bg-green-400 transition duration-100"
        />
      </form>
    </div>
  );
}

AddBlogPost.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handleBodyChange: PropTypes.func.isRequired
};

export default AddBlogPost;
