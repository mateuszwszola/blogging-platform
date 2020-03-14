import React from 'react';
import { InputGroup, InputSubmit } from '../../../layout/Input';
import { useInput } from '../../../../hooks';

function CreateBlogForm() {
  const [blogName, handleBlogNameChange] = useInput('');
  const [description, handleDescriptionChange] = useInput('');

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
          name="blog-description"
          placeholder="Describe your blog"
          classnames="border border-gray-400"
          value={description}
          handleChange={handleDescriptionChange}
          label="Blog Description"
        />
        <InputSubmit
          value="Create A Blog"
          classnames="w-1/2 max-w-sm mx-auto block my-6 bg-green-300 hover:bg-green-400 transition duration-100"
        />
      </form>
    </div>
  );
}

export default CreateBlogForm;
