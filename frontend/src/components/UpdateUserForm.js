import React from 'react';
import { useAuth } from 'context/AuthContext';
import useForm from 'hooks/useForm';
import useStatus from 'hooks/useStatus';
import { InputGroup, InputSubmit } from 'components/layout/Input';
import Loading from './Loading';

function UpdateUserForm() {
  const {
    data: { user },
    updateUser,
  } = useAuth();
  const {
    handleChange,
    handleSubmit,
    values: { name, bio },
    errors,
    setErrors,
  } = useForm(
    {
      name: (user && user.name) || '',
      bio: (user && user.bio) || '',
    },
    handleUpdateUser
  );

  const { status, requestStarted, requestFailed } = useStatus();

  function handleUpdateUser() {
    const newUserData = { name, bio };

    requestStarted();
    updateUser(newUserData).catch((err) => {
      requestFailed();
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ message: 'There was the problem with the server' });
      }
    });
  }

  const loading = status === 'pending';
  const buttonDisabled = user && user.name === name && user.bio === bio;

  return (
    <div className="relative">
      {errors.message && (
        <p className="text-red-500 text-sm text-center">{errors.message}</p>
      )}
      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit}>
          <InputGroup
            classnames="border border-gray-400"
            isError={!!(errors.name || errors.message)}
            errors={errors}
            value={name}
            handleChange={handleChange}
            name="name"
            label="User Name"
          />
          <InputGroup
            classnames="border border-gray-400"
            isError={!!(errors.bio || errors.message)}
            errors={errors}
            value={bio}
            handleChange={handleChange}
            name="bio"
            label="User Bio"
          />

          <InputSubmit
            disabled={buttonDisabled}
            value="Update User"
            classnames="w-1/2 max-w-sm mx-auto block my-6 bg-green-300 hover:bg-green-400 transition duration-100"
          />
        </form>
      )}
    </div>
  );
}

export default UpdateUserForm;
