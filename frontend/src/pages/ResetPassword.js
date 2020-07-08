import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import useForm from 'hooks/useForm';
import { useAlert } from 'context/AlertContext';
import { receiveNewPassword } from 'api/auth';
import { InputGroup, InputSubmit } from 'components/layout/Input';
import { KeyIcon, LockOpenIcon } from 'icons';

function ResetPassword() {
  const { userId, token } = useParams();
  const [setNewPassword, { isLoading }] = useMutation(receiveNewPassword);
  const {
    values: { password, repeatPassword },
    handleChange,
    handleSubmit,
    errors,
  } = useForm(
    { password: '', repeatPassword: '' },
    handleSetNewPassword,
    validate
  );
  const { setAlert } = useAlert();

  async function handleSetNewPassword() {
    setNewPassword(
      { userId, token, password },
      {
        onSuccess: (res) => {
          setAlert('success', res.message, 3000);
        },
        onError: (err) => {
          setAlert('error', 'Unable to change password', 3000);
        },
      }
    );
  }

  return (
    <div className="flex-auto flex justify-center items-center bg-gray-900 px-4 py-2 sm:py-4">
      <div className="flex flex-col justify-center items-center max-w-xs sm:max-w-sm w-full relative">
        <div className={`${isLoading ? 'opacity-50 ' : ''}text-red-500 z-20`}>
          <LockOpenIcon className="w-32 h-32 sm:w-40 sm:h-40 fill-current" />
        </div>

        <form
          onSubmit={handleSubmit}
          className={`${
            isLoading ? 'opacity-50 ' : ''
          }flex flex-col w-full sm:mt-2"`}
        >
          <InputGroup
            isError={
              !!(
                Object.keys(errors).length > 0 &&
                (errors.password || errors.message)
              )
            }
            errors={errors}
            type="password"
            name="password"
            placeholder="password"
            value={password}
            handleChange={handleChange}
            icon={KeyIcon}
          />

          <InputGroup
            isError={
              !!(
                Object.keys(errors).length > 0 &&
                (errors.repeatPassword || errors.message)
              )
            }
            errors={errors}
            type="password"
            name="repeatPassword"
            placeholder="Confirm password"
            value={repeatPassword}
            handleChange={handleChange}
            icon={KeyIcon}
          />

          <div className="w-11/12 mx-auto mt-2 sm:mt-4">
            <InputSubmit
              value={`${isLoading ? 'Loading...' : 'Set new password'}`}
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

function validate(values) {
  let errors = {};
  if (!values.password) {
    errors.password = 'password is required';
  }
  if (!values.repeatPassword) {
    errors.repeatPassword = 'password confirmation is required';
  }
  if (values.password !== values.repeatPassword) {
    errors.repeatPassword = 'password must match';
  }
  return errors;
}

export default ResetPassword;
