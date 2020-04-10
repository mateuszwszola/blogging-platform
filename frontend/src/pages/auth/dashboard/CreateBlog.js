import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'hooks';
import validate from 'utils/CreateBlogValidationRules';
import { createBlog } from 'api/blog';
import { useAlert } from 'context/AlertContext';
import Loading from 'components/Loading';
import { InputGroup, InputSubmit } from 'components/layout/Input';

function CreateBlog({
  handleChange,
  handleSubmit,
  name,
  description,
  errors,
  loading,
}) {
  return (
    <div className="max-w-screen-md mx-auto border-b border-gray-400 mt-6 relative">
      {loading && (
        <div className="z-30 absolute top-0 bottom-0 left-0 right-0">
          <Loading />
        </div>
      )}
      <h1 className="text-3xl text-center leading-loose">Create A Blog</h1>
      <form
        onSubmit={handleSubmit}
        className={`${loading ? 'opacity-50' : 'opacity-100'}`}
      >
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
  loading: PropTypes.bool.isRequired,
};

function CreateBlogContainer({ reloadBlogs }) {
  const {
    handleChange,
    handleSubmit,
    handleReset,
    values: { name, description },
    errors,
    setErrors,
  } = useForm(
    {
      name: '',
      description: '',
    },
    handleCreateBlog,
    validate
  );
  const [status, setStatus] = React.useState('idle');

  const { setAlert } = useAlert();

  function handleCreateBlog() {
    const data = { name, description };
    setStatus('creating');
    createBlog(data)
      .then((res) => {
        handleReset();
        setStatus('created');
        setAlert('success', 'Blog Created');
        reloadBlogs();
      })
      .catch((err) => {
        setStatus('error');
        if (err.errors) {
          setErrors(err.errors);
        } else {
          setErrors({
            message:
              err.message ||
              'There is a problem with the server. Try again later',
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
      loading={status === 'creating'}
    />
  );
}

CreateBlogContainer.propTypes = {
  reloadBlogs: PropTypes.func.isRequired,
};

export default CreateBlogContainer;