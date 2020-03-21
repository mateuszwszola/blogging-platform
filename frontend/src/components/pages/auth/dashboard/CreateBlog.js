import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InputGroup, InputSubmit } from '../../../layout/Input';
import { useForm } from '../../../../hooks';
import validate from '../../../../utils/CreateBlogValidationRules';
import { createBlog } from '../../../../api/blog';
import Alert from '../../../Alert';

function CreateBlog({
  handleChange,
  handleSubmit,
  name,
  description,
  errors,
  displayMessage,
  onCloseMessage
}) {
  return (
    <div className="max-w-screen-md mx-auto border-b border-gray-400 mt-6">
      {displayMessage && (
        <Alert message="Blog created" type="success" onClose={onCloseMessage} />
      )}
      <h1 className="text-3xl text-center leading-loose">Create A Blog</h1>
      <form onSubmit={handleSubmit}>
        <InputGroup
          isError={
            !!(
              Object.keys(errors).length > 0 &&
              (errors.name || errors.message)
            )
          }
          errors={errors}
          name="name"
          placeholder="Name"
          classnames="border border-gray-400"
          value={name}
          handleChange={handleChange}
          label="Blog Name"
        />
        <InputGroup
          isError={
            !!(
              Object.keys(errors).length > 0 &&
              (errors.description || errors.message)
            )
          }
          errors={errors}
          name="description"
          placeholder="Describe your blog"
          classnames="border border-gray-400"
          value={description}
          handleChange={handleChange}
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

CreateBlog.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  displayMessage: PropTypes.bool.isRequired,
  onCloseMessage: PropTypes.func.isRequired
};

function CreateBlogContainer({ reloadBlogs }) {
  const {
    handleChange,
    handleSubmit,
    handleReset,
    values: { name, description },
    errors,
    setErrors
  } = useForm(
    {
      name: '',
      description: ''
    },
    handleCreateBlog,
    validate
  );

  const [displayMessage, setDisplayMessage] = useState(false);
  const onCloseMessage = () => setDisplayMessage(false);

  function handleCreateBlog() {
    const data = { name, description };
    createBlog(data)
      .then(res => {
        reloadBlogs();
        handleReset();
        setDisplayMessage(true);
      })
      .catch(err => {
        if (err.errors) {
          setErrors(err.errors);
        } else {
          setErrors({
            message:
              err.message ||
              'There is a problem with the server. Try again later'
          });
        }
      });
  }

  return (
    <CreateBlog
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      name={name}
      description={description}
      errors={errors}
      displayMessage={displayMessage}
      onCloseMessage={onCloseMessage}
    />
  );
}

CreateBlogContainer.propTypes = {
  reloadBlogs: PropTypes.func.isRequired
};

export default CreateBlogContainer;
