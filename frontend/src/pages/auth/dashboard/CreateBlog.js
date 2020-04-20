import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'hooks';
import validate from 'utils/CreateBlogValidationRules';
import { createBlog } from 'api/blog';
import { useAlert } from 'context/AlertContext';
import Loading from 'components/Loading';
import { InputGroup, InputSubmit } from 'components/layout/Input';

function CreateBlog({ addBlog }) {
  const {
    handleChange,
    handleSubmit,
    handleReset,
    values: { name, description, bgImgUrl, imgAttribution },
    errors,
    setErrors,
  } = useForm(
    {
      name: '',
      description: '',
      bgImgUrl: '',
      imgAttribution: '',
    },
    handleCreateBlog,
    validate
  );
  const [status, setStatus] = React.useState('idle');
  const { setAlert } = useAlert();

  function handleCreateBlog() {
    const data = { name, description, bgImgUrl, imgAttribution };
    setStatus('pending');
    createBlog(data)
      .then((res) => {
        handleReset();
        setStatus('created');
        setAlert('success', 'Blog Created');
        addBlog(res.blog);
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

  const loading = status === 'pending';

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
          placeholder="Give it a name like 'Programming with John'"
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
          placeholder="What is your blog about?"
          classnames="border border-gray-400"
          value={description}
          handleChange={handleChange}
          label="Blog Description"
        />

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

        <InputGroup
          name="imgAttribution"
          value={imgAttribution}
          handleChange={handleChange}
          placeholder="Photo By ... On ..."
          classnames="border border-gray-400"
          label="Image Attribution"
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
  addBlog: PropTypes.func.isRequired,
};

export default CreateBlog;
