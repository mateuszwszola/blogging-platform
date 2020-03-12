import React, { useState } from 'react';
import { InputGroup, InputSubmit } from '../../../layout/Input';
import { useInput } from '../../../../hooks';

function CreateBlogForm() {
  const [blogName, handleBlogNameChange] = useInput('');
  const [tags, setTags] = useState('');

  const handleTagsChange = event => {
    setTags(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
  };

  return (
    <div className="max-w-screen-md mx-auto border-b border-gray-400 mt-6">
      <h1 className="text-3xl text-center leading-loose">Create A Blog</h1>
      <form onSubmit={handleSubmit}>
        <InputGroup
          name="blog-name"
          placeholder="Name"
          classnames="border border-gray-400"
          value={blogName}
          handleChange={handleBlogNameChange}
          label="Blog Name"
        />
        <InputGroup
          name="blog-tags"
          placeholder="Give it a tags (separate them using comma)"
          classnames="border border-gray-400"
          value={tags}
          handleChange={handleTagsChange}
          label="Tags (what the blog is about?)"
        />
        <div>
          {tags.split(',').length > 1 &&
            tags
              .split(',')
              .slice(0, tags.split(',').length - 1)
              .map(tag => (
                <span className="bg-blue-500 p-2 mt-1 text-blue-100 rounded mr-1">
                  {tag}
                </span>
              ))}
        </div>
        <InputSubmit
          value="Create A Blog"
          classnames="w-1/2 max-w-sm mx-auto block my-6 bg-green-300 hover:bg-green-400 transition duration-100"
        />
      </form>
    </div>
  );
}

export default CreateBlogForm;
