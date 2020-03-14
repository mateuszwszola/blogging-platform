import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { InputGroup, InputSubmit } from '../../../layout/Input';
import api from '../../../../api/api';
import { useForm } from '../../../../hooks';
import validate from '../../../../utils/AddBlogPostValidationRules';

function AddBlogPost({
  blog,
  body,
  title,
  tags,
  handleSubmit,
  handleChange,
  errors,
  ...props
}) {
  return (
    <div className="max-w-screen-md mx-auto border-b border-gray-400 mt-6">
      <h1 className="text-3xl text-center leading-loose">
        Add Blog Post To
        <span className="uppercase text-green-600 pl-4">{blog.name}</span>
      </h1>
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
          {tags.split(',').length > 1 &&
            tags
              .split(',')
              .slice(0, tags.split(',').length - 1)
              .map(tag => (
                <span
                  key={tag}
                  className="bg-blue-500 p-2 mt-1 text-blue-100 rounded mr-1"
                >
                  {tag}
                </span>
              ))}
        </div>
        <label>
          <span className="text-sm uppercase text-gray-800 font-semibold">
            Post Body
          </span>
          <textarea
            name="body"
            value={body}
            onChange={handleChange}
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
  blog: PropTypes.object.isRequired,
  tags: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

function AddBlogPostContainer(props) {
  const { blogSlug } = useParams();
  const [blog, setBlog] = useState(null);
  const [status, setStatus] = useState('loading');
  const {
    handleChange,
    handleSubmit,
    handleReset,
    values: { title, tags, body },
    errors,
    setErrors
  } = useForm(
    {
      title: '',
      tags: '',
      body: ''
    },
    addBlogPost,
    validate
  );

  function addBlogPost() {
    console.log('Add blog post form submit');
    const data = { title, body, tags };
    if (blog === null) return;
    api(`posts/${blog._id}`, 'POST', { body: data })
      .then(res => {
        handleReset();
      })
      .catch(err => {
        if (err.errors) {
          setErrors(err.errors);
        } else {
          setErrors({
            message:
              err.message ||
              'There is a problem with the server. Try again later.'
          });
        }
      });
  }

  useEffect(() => {
    let canceled = false;

    if (!canceled && status === 'loading') {
      api(`blogs/slug/${blogSlug}`)
        .then(res => {
          setBlog(res.blog);
          setStatus('loaded');
        })
        .catch(err => {
          console.error(err);
          setStatus('error');
        });
    }
    return () => (canceled = true);
  }, [status, blogSlug]);

  if (status === 'loading' || !blog) {
    return <div>Loading...</div>;
  }

  return (
    <AddBlogPost
      blog={blog}
      tags={tags}
      title={title}
      body={body}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      errors={errors}
    />
  );
}

export default AddBlogPostContainer;
