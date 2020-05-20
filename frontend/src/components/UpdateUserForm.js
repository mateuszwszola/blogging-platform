import React, { useEffect } from 'react';
import { useUser } from 'context/UserContext';
import useForm from 'hooks/useForm';
import useStatus from 'hooks/useStatus';
import { InputGroup, InputSubmit } from 'components/layout/Input';
import { LoadingWithOverlay } from './Loading';
import updateUserValidationRules from 'utils/updateUserValidatoinRules';
import { updateUser } from 'api/user';
import { useAlert } from 'context/AlertContext';

function UpdateUserForm() {
  const { user, setUser } = useUser();
  const {
    handleChange,
    handleSubmit,
    setValues,
    values: { name, bio },
    errors,
    setErrors,
  } = useForm(
    {
      name: (user && user.name) || '',
      bio: (user && user.bio) || '',
    },
    handleUpdateUser,
    updateUserValidationRules
  );
  const { setAlert } = useAlert();

  const {
    loading,
    error,
    success,
    requestStarted,
    requestFailed,
    requestSuccessful,
  } = useStatus();

  useEffect(() => {
    if (success) {
      setAlert('success', 'Profile updated!');
    }
  }, [success, setAlert]);

  function handleUpdateUser() {
    const newUserData = { name, bio };

    requestStarted();
    updateUser(newUserData)
      .then((response) => {
        requestSuccessful();
        setUser(response.user);
      })
      .catch((err) => {
        requestFailed();
        if (err.errors) {
          setErrors(err.errors);
        } else {
          setErrors({ message: 'There was the problem with the server' });
        }
      });
  }

  const handleBlur = (e) => {
    if (e.relatedTarget === null) {
      setValues((values) => ({
        ...values,
        [e.target.name]: (user && user[e.target.name]) || values[e.target.name],
      }));
    }
  };

  const buttonDisabled = user && user.name === name && user.bio === bio;

  return (
    <div className="relative">
      {error && (
        <p className="text-red-500 text-sm text-center">
          {errors.message || 'Cannot update the user'}
        </p>
      )}
      {loading && <LoadingWithOverlay />}
      <form
        onSubmit={handleSubmit}
        className={`${loading ? 'opacity-75' : 'opacity-100'}`}
      >
        <InputGroup
          classnames="border border-gray-400"
          isError={!!(errors.name || errors.message)}
          errors={errors}
          value={name}
          handleChange={handleChange}
          onBlur={handleBlur}
          name="name"
          label="User Name"
        />
        <InputGroup
          classnames="border border-gray-400"
          isError={!!(errors.bio || errors.message)}
          errors={errors}
          value={bio}
          handleChange={handleChange}
          onBlur={handleBlur}
          name="bio"
          label="User Bio"
        />

        <InputSubmit
          disabled={buttonDisabled}
          value="Update User"
          classnames="w-1/2 max-w-sm mx-auto block my-6 bg-green-300 hover:bg-green-400 transition duration-100"
        />
      </form>
    </div>
  );
}

export default UpdateUserForm;
